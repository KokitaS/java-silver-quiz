# 03 var・final・変数スコープ

> ひとことで言うと: 変数は「宣言した `{ }` の中」だけで生きる。`var` は型を書き忘れるのではなく、コンパイラが一度だけ決める。

読む目安: 7分 / 公式カテゴリ: 2 基本データ型・文字列

## 基本

### var(ローカル変数の型推論)
右辺を見て、**コンパイル時**に型が決まります。動的型付けではありません。

```java
public class Main {
    public static void main(String[] args) {
        var n = 10;                  // int
        var s = "hi";                // String
        var list = new java.util.ArrayList<String>();   // ArrayList<String>
        var total = n * 2.5;         // double(演算結果にも使える)
        System.out.println(total);
        // s = 5;                    // コンパイルエラー(String に int は入らない)
    }
}
// 出力: 25.0
```

使えない場所・書き方:
- フィールド、メソッドの引数・戻り値には使えない(**ローカル変数のみ**)。
- 初期化なしの `var x;`、`var x = null;`、`var a = 1, b = 2;`、`var arr = {1, 2};` はコンパイルエラー。

### final
- `final` 変数は**再代入できない**。
- `final int[] arr` でも、**要素の変更はできる**。禁止なのは `arr = new int[]{}` のような参照の付け替え。

### スコープと初期化
- 変数は宣言した `{ }` の中だけで有効。ブロックを出ると使えない。
- フィールドには初期値があるが、**ローカル変数には初期値がない**。代入前に読むとコンパイルエラー。
- 内側のブロックで、外側と同じ名前のローカル変数は宣言できない(コンパイルエラー)。

```java
int x = 1;
{
    // int x = 2;   // コンパイルエラー(すでに x がある)
    int y = 2;
}
// System.out.println(y);  // コンパイルエラー(y はブロックの外)
```

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `var x = null;` | コンパイルエラー(型が決まらない) |
| `var` を引数やフィールドに使う | コンパイルエラー |
| `var s = "a"; s = 5;` | コンパイルエラー(推論後は型固定) |
| `final int[] a = {1}; a[0] = 9;` | **OK**(要素変更はできる) |
| `final int[] a = {1}; a = new int[2];` | コンパイルエラー |
| ローカル変数の初期値 | **ない**。読むとコンパイルエラー |
| `for` の `int i` をループの外で使う | コンパイルエラー |

## 確認ミニ問題

**Q1.** コンパイルが通るのは?

1. `var x;`
2. `var x = null;`
3. `var x = 10;`
4. `var x = 1, y = 2;`

<details><summary>答え</summary>

**3**。1・2・4 は型を推論できない/複数宣言でエラー。

</details>

**Q2.** 次のコードの結果は?
```java
final int[] a = {1, 2};
a[0] = 9;
System.out.println(a[0]);
```
1. 1
2. 9
3. コンパイルエラー
4. 実行時エラー

<details><summary>答え</summary>

**2**。`final` は参照の付け替えを禁止するだけで、要素の変更は OK。

</details>

**Q3.** 次のコードはどうなる?
```java
int count;
System.out.println(count);
```
1. 0 が出力される
2. null が出力される
3. コンパイルエラー
4. 実行時エラー

<details><summary>答え</summary>

**3**。ローカル変数は初期値がなく、代入前に読むとコンパイルエラー(フィールドなら 0)。

</details>
