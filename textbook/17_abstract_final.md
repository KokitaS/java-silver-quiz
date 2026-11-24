# 17 抽象クラス・final

> ひとことで言うと: `abstract` は「未完成の設計図(直接は作れない)」、`final` は「これ以上変えさせない」。

読む目安: 7分 / 公式カテゴリ: 5 継承・インターフェイス

## 基本

### 抽象クラス
```java
public class Main {
    static abstract class Shape {
        abstract double area();                          // 本体なし(子が必ず実装する)
        void show() { System.out.println("area=" + area()); }   // 普通のメソッドも書ける
    }
    static class Circle extends Shape {
        double area() { return 3.0 * 2 * 2; }
    }

    public static void main(String[] args) {
        // Shape s = new Shape();      // コンパイルエラー(抽象クラスは new できない)
        Shape s = new Circle();
        s.show();
    }
}
// 出力: area=12.0
```

- `abstract class` は**インスタンス化できない**(`new` 不可)。
- 抽象メソッドには**本体がない**(`{ }` を書くとエラー)。`;` で終える。
- 抽象メソッドを持てるのは抽象クラスだけ。
- 子クラスは、**すべての抽象メソッドを実装する**か、自分も `abstract` にする。
- 抽象クラスにも**コンストラクタ**や普通のフィールド・メソッドを書ける(子の `new` 時に呼ばれる)。
- 抽象メソッドは、`private`、`static`、`final` と**組み合わせられない**(`abstract` と矛盾する)。

### final
| 付ける場所 | 意味 |
|---|---|
| 変数 | 再代入できない |
| メソッド | **オーバーライドできない** |
| クラス | **継承できない**(例: `String`) |

- `abstract final class` は矛盾していてコンパイルエラー。
- `final` クラスの `new` は OK。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `new 抽象クラス()` | コンパイルエラー |
| 抽象メソッドに `{ }` | コンパイルエラー |
| 抽象メソッドを実装しない子クラス | コンパイルエラー(`abstract` にすれば OK) |
| 抽象クラスにコンストラクタ | **書ける**(子から `super()` で呼ばれる) |
| `abstract` と `final` を同時 | コンパイルエラー |
| `abstract private void f();` | コンパイルエラー |
| `final` クラスを `extends` | コンパイルエラー |
| 抽象メソッドがない抽象クラス | 有効(`new` はできない) |

## 確認ミニ問題

**Q1.** コンパイルエラーになるのは?
```java
abstract class A { abstract void f(); }
```
1. `class B extends A { void f() { } }`
2. `abstract class B extends A { }`
3. `class B extends A { }`
4. `A a = new B();`(B は 1 の定義)

<details><summary>答え</summary>

**3**。抽象メソッド `f()` を実装していない具象クラスはエラー。

</details>

**Q2.** 有効な宣言は?

1. `abstract final class X { }`
2. `abstract class X { abstract void f() { } }`
3. `abstract class X { abstract void f(); }`
4. `class X { abstract void f(); }`

<details><summary>答え</summary>

**3**。1 は矛盾、2 は本体あり、4 は抽象メソッドを通常クラスに書いている。

</details>

**Q3.** `final` について正しいのは?

1. `final` メソッドをオーバーライドできる
2. `final` クラスを継承できる
3. `final` 変数は再代入できない
4. `final` は変数にしか付けられない

<details><summary>答え</summary>

**3**。メソッドとクラスにも付けられ、それぞれオーバーライド禁止・継承禁止。

</details>
