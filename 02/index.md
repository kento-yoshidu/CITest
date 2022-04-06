# 変数の宣言と代入

```cs
class MyClass
{
    static void Main(string[] args)
    {
        int age = 35;
        System.Console.WriteLine("My age is {0}", age);
    }
}
```

変数の埋め込みと展開。

```cs
class MyClass
{
    static void Main(string[] args)
    {
        int age = 35;
        string name = "Kento";
        System.Console.WriteLine("My age is {0}.\nMy name is {1}.", age, name);
    }
}
```

再代入可能。

```cs
class MyClass
{
    static void Main(string[] args)
    {
        int age = 35;
        string name = "Kento";
        name = "Takashi";
        System.Console.WriteLine("My age is {0}.\nMy name is {1}.", age, name);
        //=> My age is 35.
        //=> My name is Takashi.
    }
}
```

`var`を使えば型を推論してくれる。

```cs
class MyClass
{
    static void Main(string[] args)
    {
        var age = 35; // int
        var name = "Kento"; //string

        age = "35";
        // error CS0029: 型 'string' を型 'int' に暗黙的に変換できません。
    }
}
```

`ReadLine`でコンソールから受け取れる。

```cs
class MyClass
{
    static void Main(string[] args)
    {
        var input = System.Console.ReadLine();

        System.Console.WriteLine("Hello {0}", input);
    }
}
```

整数型は`int`。32bit。浮動小数点数は`double`。64bit。

文字列型は`string`、文字型は`char`、文字型はシングルクオートで囲う。

真偽値型は`bool`。
