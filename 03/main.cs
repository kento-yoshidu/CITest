class Program
{
    static void Main(string[] args)
    {
        System.Console.WriteLine("[1], {0}", 10 / 3);
        //=> 3

        // 32bit
        int num1 = 10;
        // 64bit
        double num2 = 3;

        System.Console.WriteLine("[2], {0}", num1 / num2);
        //=> 3.33333333333333

        // 64bit
        long num3 = 10;

        System.Console.WriteLine("[3], {0}", num3 / num2);
        //=> 3
    
        System.Console.WriteLine((4 + 8) / 4);
        //=> 3

        System.Console.WriteLine(-(3 + 3));
        //=> -6

        var num4 = 10;
        var num5 = num1;

        num4 = 100;

        System.Console.WriteLine("num4は{0}、num5は{1}", num4, num5);
        //=> num4は100、num5は10

        long num6 = 10;
        float num7 = 3;

        System.Console.WriteLine(num6 / num7);

        System.Console.WriteLine("[8], {0}", (float)10 / 3);
        //=> 3.333333
    }
}
