# 16 継承・super・オーバーライド

> ひとことで言うと: 子は親の機能を引き継ぎ、必要な部分だけ上書き(オーバーライド)する。親のコンストラクタが**先に**動く。

読む目安: 9分 / 公式カテゴリ: 5 継承・インターフェイス

## 基本

### extends とコンストラクタの順序
```java
public class Main {
    static class Parent {
        Parent() { System.out.println("Parent"); }
        void hello() { System.out.println("Parent.hello"); }
    }
    static class Child extends Parent {
        Child() {
            super();                       // 省略しても自動で入る(必ず1行目)
            System.out.println("Child");
        }
        @Override
        void hello() {
            super.hello();                 // 親のメソッドを呼ぶ
            System.out.println("Child.hello");
        }
    }

    public static void main(String[] args) {
        Child c = new Child();
        c.hello();
    }
}
// 出力: Parent
// 出力: Child
// 出力: Parent.hello
// 出力: Child.hello
```

- クラスの継承は**1つだけ**(`extends` の後ろに1クラス)。
- 子のコンストラクタの先頭には、**`super()` が暗黙で入る**。親に**引数なしのコンストラクタがない**場合、子で `super(引数)` を明示しないと**コンパイルエラー**。
- `private` なメンバーは継承されない(子から使えない)。
- すべてのクラスは `Object` を継承している。

### オーバーライドの条件
親のメソッドを子で**書き直す**ときのルール:

| 項目 | ルール |
|---|---|
| 名前・引数 | **同じ** |
| 戻り値 | 同じ、または**サブクラス型**(共変) |
| アクセス修飾子 | 親と**同じか広く**(狭くはできない) |
| 例外(`throws`) | 親が投げる **checked 例外より広いものは不可** |
| `static` | オーバーライドではなく**隠す**(ポリモーフィズムしない) |
| `private` / `final` | オーバーライドできない |

- `@Override` を付けると、オーバーライドになっていないときにコンパイルエラーで教えてくれる(付け忘れても動く)。
- オーバーライドとオーバーロードは別。**引数が違えばオーバーロード**。

### フィールドは上書きされない
フィールドは**宣言した型**で決まる(隠れるだけ)。メソッドは**実際のオブジェクト**で決まる。詳しくは 19。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| 親にだけ引数ありコンストラクタ | 子がコンパイルエラー(`super(引数)` が必要) |
| `super(...)` を2行目に書く | コンパイルエラー |
| 親が `public`、子が `protected` でオーバーライド | コンパイルエラー(狭くなる) |
| `final` メソッドのオーバーライド | コンパイルエラー |
| `@Override` を付けたが引数が違う | コンパイルエラー |
| `static` メソッドを子で再定義 | オーバーライドではなく隠す |
| `private` メソッドを子で再定義 | 別のメソッド(オーバーライドではない) |
| 親と子の初期化順 | 親のコンストラクタ → 子のコンストラクタ |

## 確認ミニ問題

**Q1.** 出力は?
```java
class A { A() { System.out.print("A "); } }
class B extends A { B() { System.out.print("B "); } }
// new B();
```
1. `B `
2. `A `
3. `A B `
4. `B A `

<details><summary>答え</summary>

**3**。子のコンストラクタの先頭で親のコンストラクタ(`super()`)が実行される。

</details>

**Q2.** 親が `public void f() { }` のとき、子のオーバーライドとして**コンパイルが通る**修飾子は?
```java
class P { public void f() { } }
class C extends P { ______ void f() { } }
```
1. `protected`
2. `private`
3. 修飾子なし
4. `public`

<details><summary>答え</summary>

**4**。オーバーライドでアクセスを狭めることはできない。親が `public` なら子も `public`。

</details>

**Q3.** 次のうち、オーバーライドにならないのは?

1. 親 `void f(int a)`、子 `void f(int a)`
2. 親 `Object f()`、子 `String f()`
3. 親 `void f(int a)`、子 `void f(long a)`
4. 親 `protected void f()`、子 `public void f()`

<details><summary>答え</summary>

**3**。引数の型が違うのでオーバーロード。2 は戻り値の共変、4 はアクセスを広げているので OK。

</details>
