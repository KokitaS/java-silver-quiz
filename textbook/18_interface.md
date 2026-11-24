# 18 インターフェイス(default・static・private)

> ひとことで言うと: 「できること」の約束事。クラスは何個でも実装できる。default メソッドが衝突したら、自分で解決する。

読む目安: 10分 / 公式カテゴリ: 5 継承・インターフェイス / 弱点: default 競合

## 基本

### インターフェイスの中身
```java
interface Walker {
    int SPEED = 5;                           // 自動で public static final(定数)
    void walk();                             // 自動で public abstract
    default void rest() { System.out.println("rest"); }      // 本体あり。実装側で上書きできる
    static void info() { System.out.println("walker"); }     // static。インターフェイス名で呼ぶ
    private void helper() { }                // Java 9+。内部の共通処理用
}
```

| メンバー | 暗黙の修飾子 | 備考 |
|---|---|---|
| フィールド | `public static final` | 変更不可 |
| 抽象メソッド | `public abstract` | |
| `default` メソッド | `public` | 実装側が上書き可 |
| `static` メソッド | `public` | **`インターフェイス名.メソッド()`** でしか呼べない(実装クラスや変数からは不可) |
| `private` メソッド | | default/static メソッドの共通処理用 |

- インターフェイスは `new` できない。
- クラスは `implements` で**複数**実装できる。インターフェイス同士は `extends` で**複数**継承できる。
- 実装するメソッドは **`public`** にしなければならない(アクセスを狭められないため。書き忘れるとコンパイルエラー)。
- 抽象クラスと違い、インスタンスフィールドやコンストラクタは持てない。

### default メソッドの競合
2つのインターフェイスに同名の `default` メソッドがあり、両方を実装すると、**どちらを使うか決められずコンパイルエラー**。実装クラスで**オーバーライドして解決**する。

```java
public class Main {
    interface A { default void hello() { System.out.println("A"); } }
    interface B { default void hello() { System.out.println("B"); } }

    static class C implements A, B {
        public void hello() {
            A.super.hello();              // どちらを使うか明示できる
            System.out.println("C");
        }
    }

    public static void main(String[] args) {
        new C().hello();
    }
}
// 出力: A
// 出力: C
```

- **継承関係がある場合**(`B extends A` で B が上書き)は、**より具体的な B が自動で優先**され、エラーにならない。
- **クラスのメソッドとインターフェイスの default が同名**なら、**クラス側が優先**。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| 無関係な2つの default が同名 | 実装クラスで解決しないとコンパイルエラー |
| 継承関係のある default | サブ側が優先(エラーにならない) |
| 実装メソッドを `public` なしで書く | コンパイルエラー |
| インターフェイスのフィールドに代入 | コンパイルエラー(`final`) |
| 実装クラスの変数から `static` メソッド | コンパイルエラー(`インターフェイス名.` が必要) |
| `new インターフェイス()` | コンパイルエラー |
| `private` メソッドを実装クラスから | 呼べない |
| 親クラスの同名メソッド vs default | クラス側が優先 |

## 確認ミニ問題

**Q1.** コンパイルエラーになるのは?
```java
interface X { default void f() { } }
interface Y { default void f() { } }
class Z implements X, Y { }
```
1. エラーにならない
2. `Z` でオーバーライドしていないのでコンパイルエラー
3. 実行時にエラー
4. `X` が優先される

<details><summary>答え</summary>

**2**。`Z` で `f()` をオーバーライドして解決する必要がある。

</details>

**Q2.** 次のうち正しいのは?
```java
interface I { void f(); }
class C implements I { void f() { } }
```
1. 正常にコンパイルできる
2. コンパイルエラー(`public` が必要)
3. 実行時エラー
4. `f` は `protected` になる

<details><summary>答え</summary>

**2**。インターフェイスのメソッドは `public`。実装側でアクセスを狭められない。

</details>

**Q3.** `interface I { int X = 1; }` について、`I.X = 2;` を実行すると?

1. `X` が 2 になる
2. 実行時エラー
3. コンパイルエラー
4. 何も起きない

<details><summary>答え</summary>

**3**。インターフェイスのフィールドは `public static final`。再代入できない。

</details>
