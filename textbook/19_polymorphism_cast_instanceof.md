# 19 多態性・キャスト・instanceof

> ひとことで言うと: メソッドは「**中身(実際のオブジェクト)**」で決まり、フィールドは「**ラベル(宣言した型)**」で決まる。

読む目安: 10分 / 公式カテゴリ: 5 継承・インターフェイス / 弱点: キャスト判定・コンストラクタ内の動的ディスパッチ

## 基本

### ポリモーフィズム
親の型の変数に、子のオブジェクトを入れられる(アップキャスト)。このとき:
- **メソッド呼び出し** → 実際のオブジェクトの型で決まる(**動的ディスパッチ**)
- **フィールド・static メソッド** → 変数の宣言型で決まる

```java
public class Main {
    static class Animal {
        String name = "Animal";
        String sound() { return "..."; }
    }
    static class Dog extends Animal {
        String name = "Dog";
        String sound() { return "Woof"; }
        void fetch() { }
    }

    public static void main(String[] args) {
        Animal a = new Dog();            // アップキャストは自動
        System.out.println(a.name);      // フィールドは宣言型(Animal)
        System.out.println(a.sound());   // メソッドは実体(Dog)
        // a.fetch();                    // コンパイルエラー(Animal 型には fetch がない)
        Dog d = (Dog) a;                 // ダウンキャストは明示が必要
        d.fetch();
        System.out.println(d.name);
    }
}
// 出力: Animal
// 出力: Woof
// 出力: Dog
```

### キャストの判定は2段階
| 段階 | 何を見る | 結果 |
|---|---|---|
| コンパイル時 | **宣言型**と**キャスト先**に継承関係があるか | なければコンパイルエラー |
| 実行時 | **実際のオブジェクト**がキャスト先の型か | 違えば `ClassCastException` |

```java
Object o = "text";
Integer i = (Integer) o;       // コンパイル OK(Object は何にでも)→ 実行時 ClassCastException

Animal a2 = new Animal();
Dog d2 = (Dog) a2;             // コンパイル OK(継承関係あり)→ 実行時 ClassCastException

Integer n = 5;
// String s = (String) n;      // コンパイルエラー(Integer と String に継承関係なし)
```

### instanceof
キャスト前の安全チェック。**null は常に false**(例外にならない)。

```java
public class Main {
    public static void main(String[] args) {
        Object o = "hello";
        if (o instanceof String s) {           // Java 16+: 判定と変数宣言を一度に
            System.out.println(s.length());    // s は String として使える
        }
        String n = null;
        System.out.println(n instanceof String);
    }
}
// 出力: 5
// 出力: false
```

- パターン変数(`s`)は、条件が true になる範囲(`&&` の右側や if の中)だけで使える。
- 継承関係のない型との `instanceof`(例: `Integer` 型の変数 `instanceof String`)はコンパイルエラー。

### コンストラクタの中の動的ディスパッチ(難問)
親のコンストラクタの中でオーバーライドされたメソッドを呼ぶと、**子のメソッドが動く**。でも子のフィールドは**まだ初期化前**(初期値のまま)。

```java
public class Main {
    static class P {
        P() { show(); }                       // 子の show が呼ばれる
        void show() { System.out.println("P"); }
    }
    static class C extends P {
        int v = 7;
        C() { super(); }
        void show() { System.out.println("v=" + v); }   // v はまだ 0
    }
    public static void main(String[] args) {
        new C();
    }
}
// 出力: v=0
```

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `Animal a = new Dog(); a.name` | Animal のフィールド |
| `a.fetch()`(Animal 型で Dog 専用) | コンパイルエラー |
| `(Dog) new Animal()` | コンパイル OK・実行時 ClassCastException |
| `(String) integer変数` | コンパイルエラー(継承関係なし) |
| `(Integer) objectの変数` | コンパイル OK(実行時に判定) |
| `null instanceof X` | false |
| 親コンストラクタから呼ばれた子のメソッド内の子のフィールド | 0 や null(初期化前) |
| static メソッドを親の型の変数で呼ぶ | 宣言型のメソッド |

## 確認ミニ問題

**Q1.** 出力は?
```java
class A { String n = "A"; String f() { return "fA"; } }
class B extends A { String n = "B"; String f() { return "fB"; } }
// A x = new B(); System.out.print(x.n + x.f());
```
1. `AfA`
2. `AfB`
3. `BfA`
4. `BfB`

<details><summary>答え</summary>

**2**。フィールドは宣言型(A)の `"A"`、メソッドは実体(B)の `"fB"`。

</details>

**Q2.** コンパイルエラーになるのは?
```java
Object o = "x";
Integer i = 5;
```
1. `Integer a = (Integer) o;`
2. `String b = (String) o;`
3. `String c = (String) i;`
4. `Object d = i;`

<details><summary>答え</summary>

**3**。`Integer` と `String` に継承関係がない。1 はコンパイル OK で、実行時に ClassCastException。

</details>

**Q3.** `String s = null;` のとき、`s instanceof String` の結果は?

1. true
2. false
3. NullPointerException
4. コンパイルエラー

<details><summary>答え</summary>

**2**。`null` は常に false。例外にならない。

</details>
