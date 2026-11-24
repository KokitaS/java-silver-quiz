# 06 配列

> ひとことで言うと: 配列は「番号付きロッカー」。数は作った時点で固定で、変数に入っているのは**ロッカー全体の場所(参照)**。

読む目安: 8分 / 公式カテゴリ: 2 基本データ型・文字列 / 弱点: 参照渡し・参照差し替え

## 基本

### 作り方と初期値
```java
public class Main {
    public static void main(String[] args) {
        int[] a = new int[3];                  // {0, 0, 0}
        String[] s = new String[2];            // {null, null}
        int[] b = {10, 20, 30};                // 初期値つき
        int[][] m = new int[2][3];             // 2行3列
        System.out.println(a[0] + " " + s[0]);
        System.out.println(b.length);          // length はフィールド(カッコなし)
        System.out.println(m[1].length);
    }
}
// 出力: 0 null
// 出力: 3
// 出力: 3
```

- 初期値: 数値は 0、`boolean` は false、`char` は `'\u0000'`、参照型は `null`。
- `length` は**フィールド**(`length()` ではない)。`String` は `length()`、`ArrayList` は `size()`。
- 範囲外のアクセスは実行時の `ArrayIndexOutOfBoundsException`(コンパイルは通る)。
- `new int[3]{1, 2, 3}` のように、サイズと初期値を**同時に書くのはコンパイルエラー**。
- 配列の中身を表示するなら `Arrays.toString(a)`。`System.out.println(a)` は `[I@…` のような参照表示になる。
- `Arrays.sort(a)` で昇順に並べ替える。

### 参照のコピーと渡し
```java
public class Main {
    static void change(int[] x) { x[0] = 99; }          // 同じ配列の中身を変更
    static void replace(int[] x) { x = new int[]{1}; }  // 手元の参照を付け替えただけ

    public static void main(String[] args) {
        int[] a = {5, 6};
        change(a);
        System.out.println(a[0]);
        replace(a);
        System.out.println(a[0]);          // 呼び出し元は変わらない
        int[] b = a;                       // 同じ配列を指す(コピーではない)
        b[1] = 7;
        System.out.println(a[1]);
    }
}
// 出力: 99
// 出力: 99
// 出力: 7
```

- Java は**値渡し**。配列の場合、渡されるのは「場所のコピー」。だから**中身の変更は呼び出し元に反映**されるが、**参照の付け替え(`x = new int[]…`)は反映されない**。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| メソッド内で `x[0] = 99` | 呼び出し元も変わる |
| メソッド内で `x = new int[]{…}` | 呼び出し元は**変わらない**(3回間違えたところ) |
| `int[] b = a; b[0] = 1;` | `a[0]` も 1(同じ配列) |
| `a.length()` | コンパイルエラー(カッコなし) |
| `new int[3]{1,2,3}` | コンパイルエラー |
| `String[]` の初期値 | `null`(`""` ではない) |
| `a[3]`(長さ3) | 実行時 ArrayIndexOutOfBoundsException |

## 確認ミニ問題

**Q1.** 出力は?
```java
static void f(int[] x) { x = new int[]{9}; }
public static void main(String[] args) {
    int[] a = {1};
    f(a);
    System.out.println(a[0]);
}
```
1. 1
2. 9
3. 0
4. コンパイルエラー

<details><summary>答え</summary>

**1**。メソッド内の付け替えは、呼び出し元の `a` には影響しない。

</details>

**Q2.** 次のコードの結果は?
```java
int[] a = {1, 2, 3};
int[] b = a;
b[0] = 10;
System.out.println(a[0]);
```
1. 1
2. 10
3. 0
4. コンパイルエラー

<details><summary>答え</summary>

**2**。`b = a` は参照のコピー。同じ配列を見ている。

</details>

**Q3.** コンパイルエラーになるのは?

1. `int[] a = new int[3];`
2. `int[] a = {1, 2, 3};`
3. `int[] a = new int[3]{1, 2, 3};`
4. `int[][] a = new int[2][3];`

<details><summary>答え</summary>

**3**。サイズと初期値は同時に書けない。

</details>
