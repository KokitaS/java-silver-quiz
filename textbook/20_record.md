# 20 record

> ひとことで言うと: 「値を持つだけのクラス」を1行で作る仕組み。コンストラクタ・取得メソッド・equals・toString が自動でできる。

読む目安: 8分 / 公式カテゴリ: 4 クラス定義 / 弱点: extends 不可(3回連続ミス)・equals の挙動

## 基本

```java
public class Main {
    record Point(int x, int y) { }

    public static void main(String[] args) {
        Point p = new Point(1, 2);
        System.out.println(p.x());                       // 取得は x()(getX() ではない)
        System.out.println(p);                           // toString も自動
        System.out.println(p.equals(new Point(1, 2)));   // 値で比較 → true
        System.out.println(p == new Point(1, 2));        // 参照の比較 → false
    }
}
// 出力: 1
// 出力: Point[x=1, y=2]
// 出力: true
// 出力: false
```

自動で作られるもの: **コンストラクタ、アクセサ(`x()`)、`equals`、`hashCode`、`toString`**

### できること・できないこと
| | できる? |
|---|---|
| `implements` でインターフェイスを実装 | **○** |
| `extends` で他のクラスを継承 | **✗**(暗黙で `java.lang.Record` を継承済み) |
| 他のクラスから `extends` される | **✗**(record は暗黙の `final`) |
| `abstract` にする | **✗** |
| 宣言したコンポーネント以外のインスタンスフィールド | **✗** |
| static フィールド・static メソッド | **○** |
| インスタンスメソッドの追加 | **○** |
| 各フィールドの値の変更 | **✗**(すべて `private final`。setter なし) |

### コンパクトコンストラクタ
値のチェックを入れたいときに使う。**引数リストを省略した**特別な書き方で、本体の後に**フィールドへの代入が自動で行われる**。

```java
public class Main {
    record Age(int value) {
        Age {                                    // 引数リストなし
            if (value < 0) {
                throw new IllegalArgumentException("negative");
            }
            // this.value = value; は書かない(自動)
        }
    }

    public static void main(String[] args) {
        System.out.println(new Age(3).value());
        try {
            new Age(-1);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
// 出力: 3
// 出力: negative
```

- コンパクトコンストラクタの中で `this.value = value;` と**書くとコンパイルエラー**(自動代入のため)。引数の `value` を**書き換えるのは OK**(その値が代入される)。
- 通常の(引数リストあり)コンストラクタを追加するなら、**1行目で他のコンストラクタ(`this(...)`)を呼ぶ**必要がある。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `record A() extends B` | コンパイルエラー |
| `record A() implements I` | OK |
| `abstract record` | コンパイルエラー |
| `p.getX()` | コンパイルエラー(`p.x()`) |
| `p1 == p2` と `p1.equals(p2)` | `==` は false、`equals` は値が同じなら true |
| record に `int z;`(コンポーネント外のインスタンスフィールド) | コンパイルエラー |
| setter で値を変える | 作れない(不変) |
| コンパクトコンストラクタ内の `this.x = x` | コンパイルエラー |

## 確認ミニ問題

**Q1.** コンパイルエラーになるのは?

1. `record R(int a) implements Comparable<R> { public int compareTo(R o) { return 0; } }`
2. `record R(int a) extends Object { }`
3. `record R(int a) { static int count = 0; }`
4. `record R(int a) { int twice() { return a * 2; } }`

<details><summary>答え</summary>

**2**。`extends` は書けない。1・3・4 は OK。

</details>

**Q2.** 出力は?
```java
record P(int x) { }
// P a = new P(5); P b = new P(5);
// System.out.print((a == b) + " " + a.equals(b));
```
1. `true true`
2. `false true`
3. `true false`
4. `false false`

<details><summary>答え</summary>

**2**。`==` は別オブジェクトなので false、`equals` は値で比較して true。

</details>

**Q3.** `record Point(int x, int y) { }` の `p` から x の値を取得するには?

1. `p.getX()`
2. `p.x`(外部クラスから)
3. `p.x()`
4. `p.get("x")`

<details><summary>答え</summary>

**3**。アクセサはコンポーネント名と同じ `x()`。

</details>
