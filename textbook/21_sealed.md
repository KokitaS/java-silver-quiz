# 21 sealed(封印されたクラス・インターフェイス)

> ひとことで言うと: 「この親を継げるのは、名簿に載っている子だけ」。名簿は `permits` で書く。

読む目安: 7分 / 公式カテゴリ: 5 継承・インターフェイス

## 基本

```java
public class Main {
    sealed interface Shape permits Circle, Square { }
    record Circle(double r) implements Shape { }
    record Square(double side) implements Shape { }

    static double area(Shape s) {
        if (s instanceof Circle c) return 3.0 * c.r() * c.r();
        if (s instanceof Square q) return q.side() * q.side();
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(area(new Circle(2)));
        System.out.println(area(new Square(3)));
    }
}
// 出力: 12.0
// 出力: 9.0
```

### ルール
- `sealed` クラス/インターフェイスは、`permits` で**継承を許可するクラスを列挙**する。
- **許可された子**は、必ず次のどれかを付ける:

| 修飾子 | 意味 |
|---|---|
| `final` | これ以上継承できない |
| `sealed` | さらに `permits` で子を制限する |
| `non-sealed` | 制限を解除して、誰でも継承できる |

- **record は暗黙で final** なので、修飾子を書かなくても OK。**enum も同様**。
- 許可された子は、`sealed` な親を `extends`/`implements` する必要がある(名簿に載っていても継承しなければエラー)。
- `permits` を省略できるのは、**同じファイルの中**に子クラスが定義されているとき。
- 同じパッケージ(または同じモジュール)に置く必要がある。

```java
sealed class Animal permits Dog, Cat { }
final class Dog extends Animal { }         // OK: final
non-sealed class Cat extends Animal { }    // OK: 制限解除 → Cat は自由に継承される
// class Bird extends Animal { }           // コンパイルエラー(名簿にない)
```

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `permits` にない子 | コンパイルエラー |
| 子に `final`/`sealed`/`non-sealed` がない(class の場合) | コンパイルエラー |
| 子が record | 修飾子は不要(暗黙の final) |
| `non-sealed` | ハイフン付きで書く |
| 名簿の子が親を継承していない | コンパイルエラー |
| sealed な親を `new` | クラスが abstract でなければ可。interface は不可 |

## 確認ミニ問題

**Q1.** コンパイルエラーになるのは?
```java
sealed class A permits B { }
```
1. `final class B extends A { }`
2. `non-sealed class B extends A { }`
3. `class B extends A { }`
4. `sealed class B extends A permits C { }`(C は B を継承している)

<details><summary>答え</summary>

**3**。許可された子には `final`・`sealed`・`non-sealed` のいずれかが必要。

</details>

**Q2.** `sealed interface S permits R { }` の `R` を record で定義するとき、コンパイルエラーになるのは?

1. `record R(int a) implements S { }`
2. `final record R(int a) implements S { }`
3. `non-sealed record R(int a) implements S { }`
4. `record R() implements S { }`

<details><summary>答え</summary>

**3**。record は暗黙の `final` なので、`non-sealed`(や `sealed`)は付けられない。修飾子なしでも OK。

</details>

**Q3.** `non-sealed` の意味は?

1. これ以上継承できない
2. 制限を解除して、誰でも継承できる
3. `permits` を省略できる
4. 抽象クラスになる

<details><summary>答え</summary>

**2**。sealed の制限を、その子の以下では解除する。

</details>
