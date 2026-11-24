# 14 static・初期化の順序

> ひとことで言うと: `static` は「クラスに1つだけ」。全員で共有する掲示板のようなもの。

読む目安: 8分 / 公式カテゴリ: 4 クラス定義 / 弱点: static の共有・シャドーイング

## 基本

### static フィールドは全員で共有
```java
public class Main {
    static class Counter {
        static int total = 0;        // クラスに1つ(全インスタンスで共有)
        int mine = 0;                // インスタンスごとに別

        Counter() {
            total++;
            mine++;
        }
    }

    public static void main(String[] args) {
        Counter a = new Counter();
        Counter b = new Counter();
        System.out.println(Counter.total);   // 2(クラス名で呼ぶのが基本)
        System.out.println(a.mine);          // 1
        System.out.println(b.total);         // 2(インスタンス経由でも同じもの)
    }
}
// 出力: 2
// 出力: 1
// 出力: 2
```

- `static` メソッドから、**インスタンスのフィールドやメソッドは直接使えない**(コンパイルエラー)。インスタンスが特定できないため。
- インスタンスのメソッドからは、static フィールドも使える。
- `null` の変数経由で static メソッドを呼んでも、**NullPointerException にならない**(型だけで決まるため)。
- `static` メソッドは**オーバーライドされず、隠される**(ポリモーフィズムしない)。

### シャドーイング(同名の隠れ)
ローカル変数や引数が同じ名前のフィールドを**隠す**。static フィールドは `クラス名.名前` で明示できる。

```java
public class Main {
    static int x = 10;
    public static void main(String[] args) {
        int x = 20;
        System.out.println(x);        // ローカルの 20
        System.out.println(Main.x);   // static フィールドの 10
    }
}
// 出力: 20
// 出力: 10
```

### 初期化ブロックと実行順
| 種類 | 書き方 | 実行タイミング |
|---|---|---|
| static 初期化ブロック | `static { ... }` | クラスが**最初に使われるとき1回だけ** |
| インスタンス初期化ブロック | `{ ... }` | `new` のたびに、コンストラクタの**前** |
| コンストラクタ | `X() { ... }` | `new` のたび |

```java
public class Main {
    static class T {
        static { System.out.println("static"); }
        { System.out.println("instance"); }
        T() { System.out.println("constructor"); }
    }
    public static void main(String[] args) {
        new T();
        new T();
    }
}
// 出力: static
// 出力: instance
// 出力: constructor
// 出力: instance
// 出力: constructor
```

- `static final` は定数(再代入不可)。慣習として大文字。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| static 変数を2つの `new` の後に確認 | 共有されて合算される |
| static メソッドでインスタンス変数を使う | コンパイルエラー |
| `null` の変数で static メソッドを呼ぶ | NPE にならない |
| static ブロックの実行回数 | クラスに対して**1回だけ** |
| ローカル変数と同名の static フィールド | ローカルが優先(`クラス名.x` で static) |
| 初期化ブロックとコンストラクタの順 | 初期化ブロックが先 |

## 確認ミニ問題

**Q1.** 出力は?
```java
class A {
    static int n = 0;
    A() { n++; }
}
// new A(); new A(); new A(); System.out.println(A.n);
```
1. 0
2. 1
3. 3
4. コンパイルエラー

<details><summary>答え</summary>

**3**。`n` は static で共有されるので、3回の `new` で3。

</details>

**Q2.** コンパイルエラーになるのは?

1. static メソッドから static フィールドを使う
2. static メソッドからインスタンスフィールドを直接使う
3. インスタンスメソッドから static フィールドを使う
4. `クラス名.staticメソッド()` を呼ぶ

<details><summary>答え</summary>

**2**。static メソッドは特定のインスタンスを持たない。

</details>

**Q3.** `static { }`、`{ }`、コンストラクタを持つクラスを `new` 2回。`static { }` が実行される回数は?

1. 0回
2. 1回
3. 2回
4. 3回

<details><summary>答え</summary>

**2**。クラスの読み込み時に1回だけ。

</details>
