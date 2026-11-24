# 12 クラス・フィールド・コンストラクタ・this

> ひとことで言うと: クラスは「設計図」、`new` で作るのが「実物(インスタンス)」。コンストラクタは実物を作るときの初期セットアップ。

読む目安: 8分 / 公式カテゴリ: 4 クラス定義

## 基本

```java
public class Main {
    static class Dog {
        String name;                 // フィールド(初期値 null)
        int age;                     // フィールド(初期値 0)

        Dog(String name) {           // コンストラクタ: 戻り値の型を書かない・クラス名と同じ
            this.name = name;        // this.name = フィールド、name = 引数
        }

        Dog() {                      // オーバーロードもできる
            this("no name");         // this(...) で別のコンストラクタを呼ぶ(必ず1行目)
        }
    }

    public static void main(String[] args) {
        Dog d = new Dog();
        System.out.println(d.name + " " + d.age);
        Dog e = new Dog("Rex");
        System.out.println(e.name);
    }
}
// 出力: no name 0
// 出力: Rex
```

### 覚えるルール
- **フィールドには初期値がある**(数値 0、boolean false、参照 null)。**ローカル変数にはない**。
- コンストラクタを**1つも書かなければ**、引数なしの**デフォルトコンストラクタ**が自動で作られる。**1つでも書くと自動では作られない**。
- コンストラクタは**戻り値の型を書かない**。戻り値の型を書くと、ただの**メソッド**になる(クラス名と同じ名前でもエラーにならない)。
- `this(...)` と `super(...)` は、コンストラクタの**1行目だけ**。両方は書けない。
- `new` をしていない変数(`Dog d;`)は何も指していない。`null` のまま使うと実行時 `NullPointerException`。
- 引数名とフィールド名が同じとき、`name = name;` は**引数に引数を代入するだけ**でフィールドは変わらない。`this.name = name;` と書く。

### 初期化の順序
オブジェクトを作るとき、**フィールドの初期値 → 初期化ブロック(`{ }`) → コンストラクタの本体**の順に実行されます。(static の場合は 14 を参照)

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `Dog(String n)` だけ定義して `new Dog()` | コンパイルエラー(デフォルトは作られない) |
| `void Dog() { }` | コンストラクタではなく**普通のメソッド** |
| `this(...)` を2行目に書く | コンパイルエラー |
| `name = name;`(引数と同名) | フィールドは変わらない |
| ローカル変数の初期値 | ない |
| `Dog d = null; d.name` | NullPointerException |

## 確認ミニ問題

**Q1.** 次のコードはどうなる?
```java
class A {
    A(int x) { }
}
public class Main {
    public static void main(String[] args) {
        A a = new A();
    }
}
```
1. 正常に実行される
2. コンパイルエラー
3. 実行時エラー
4. `null` になる

<details><summary>答え</summary>

**2**。引数ありのコンストラクタを書いたので、デフォルトコンストラクタは作られない。

</details>

**Q2.** 出力は?
```java
class P {
    int v;
    P(int v) { v = v; }
}
// new P(5).v を出力
```
1. 5
2. 0
3. null
4. コンパイルエラー

<details><summary>答え</summary>

**2**。`v = v` は引数への代入で、フィールドは初期値 0 のまま。

</details>

**Q3.** コンストラクタについて正しいのは?

1. 戻り値の型として `void` を書く
2. クラス名と違う名前でもよい
3. 1つも書かなければ引数なしのものが自動で作られる
4. 1つでも書いてもデフォルトが残る

<details><summary>答え</summary>

**3**。1つでも書くと自動では作られない。

</details>
