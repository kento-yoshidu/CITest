intとintで計算すると結果もintになる。

```cs
class Program
{
    static void Main(string[] args)
    {
        System.Console.WriteLine(10 / 3);
        //=> 3
    }
}
```

型が違う場合は、表せる範囲が大きい型で結果が出力される。

```cs
System.Console.WriteLine(10 / 3);
//=> 3

// 32bit
int num1 = 10;
// 64bit
double num2 = 3;

System.Console.WriteLine(num1 / num2);
//=> 3.33333333333333

// 64bit
long num3 = 3;

System.Console.WriteLine(num1 / num3);
//=> 3
```

[割り算の結果に要注意・・・！！ - give IT a try](https://blog.jnito.com/entry/20110910/1315605311)

`()`で優先順位を変えられる。

```cs
System.Console.WriteLine((4 + 8) / 4);
//=> 3
```

単項演算子。

```cs
System.Console.WriteLine(-(3 + 3));
//=> -6
```

値の代入。

```cs
var num4 = 10;
var num5 = num1;

num4 = 100;

System.Console.WriteLine("num4は{0}、num5は{1}", num4, num5);
//=> num4は100、num5は10
```

キャスト演算子。


