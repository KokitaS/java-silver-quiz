# 13 メソッド・オーバーロード・可変長引数・参照渡し

> ひとことで言うと: 同じ名前でも引数が違えば別のメソッド。Java は常に「値渡し」で、オブジェクトの場合は「場所のコピー」が渡る。

読む目安: 9分 / 公式カテゴリ: 4 クラス定義

## 基本

### オーバーロード
**名前が同じ・引数の型/数/順序が違う**メソッドを複数書けること。

```java
public class Main {
    static void f(int x) { System.out.println("int"); }
    static void f(long x) { System.out.println("long"); }
    static void f(Integer x) { System.out.println("Integer"); }
    static void f(int... x) { System.out.println("varargs"); }

    public static void main(String[] args) {
        f(5);               // int(完全一致が最優先)
        f(5L);              // long
        f(Integer.valueOf(5));
        f(1, 2);
        byte b = 1;
        f(b);               // byte → int に拡大して int
    }
}
// 出力: int
// 出力: long
// 出力: Integer
// 出力: varargs
// 出力: int
```

選ばれる優先順位:
1. 完全一致
2. **型の拡大**(`int` → `long` など)
3. **ボクシング**(`int` → `Integer`)
4. 可変長引数

- 戻り値の型**だけ**が違うのは、オーバーロードではなく**コンパイルエラー**。
- 引数が同じで修飾子(`static` など)だけが違うのも不可。

### 可変長引数(varargs)
```java
static int sum(int... nums) {        // nums は int[] として扱える
    int t = 0;
    for (int n : nums) t += n;
    return t;
}
// sum() → 0、sum(1, 2, 3) → 6
```
- 可変長引数は、引数リストの**最後に1つだけ**。
- 何も渡さなければ、`null` ではなく**長さ0の配列**。

### 値渡しと参照
- 基本型を渡す → 値のコピーなので、メソッド内で変えても**呼び出し元は変わらない**。
- オブジェクト・配列を渡す → 「場所のコピー」。**中身の変更は反映される**が、**変数自体の付け替えは反映されない**。
- `String` は不変なので、メソッド内で `s = s + "x"` しても呼び出し元の `s` は変わらない。`StringBuilder` の `append` は反映される。

```java
public class Main {
    static void a(StringBuilder sb) { sb.append("!"); }                 // 中身を変更
    static void b(StringBuilder sb) { sb = new StringBuilder("new"); }  // 付け替え
    public static void main(String[] args) {
        StringBuilder s = new StringBuilder("hi");
        a(s);
        b(s);
        System.out.println(s);
    }
}
// 出力: hi!
```

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `int f()` と `String f()` | コンパイルエラー(戻り値だけの違い) |
| `f(5)` で `f(long)` と `f(Integer)` がある | `f(long)`(拡大がボクシングより先) |
| 可変長引数が最後でない | コンパイルエラー |
| `sum()`(引数なし)の `nums` | 長さ0の配列(null ではない) |
| `StringBuilder` を渡して `append` | 呼び出し元に反映される |
| `StringBuilder` を渡して `= new ...` | 反映されない |
| `String` を渡して連結 | 反映されない |

## 確認ミニ問題

**Q1.** 出力は?
```java
static void m(long x)    { System.out.print("long "); }
static void m(Integer x) { System.out.print("Integer "); }
// m(10) を呼ぶ
```
1. `long `
2. `Integer `
3. コンパイルエラー(あいまい)
4. 実行時エラー

<details><summary>答え</summary>

**1**。拡大(`int` → `long`)がボクシング(`int` → `Integer`)より優先。

</details>

**Q2.** コンパイルエラーになるのは?

1. `void f(int a) {}` と `void f(String a) {}`
2. `void f(int a) {}` と `void f(int a, int b) {}`
3. `int f(int a) {}` と `void f(int a) {}`
4. `void f(int... a) {}`

<details><summary>答え</summary>

**3**。引数が同じで戻り値だけが違う。

</details>

**Q3.** 出力は?
```java
static void change(String s) { s = s + "x"; }
// String t = "a"; change(t); System.out.println(t);
```
1. `ax`
2. `a`
3. `x`
4. コンパイルエラー

<details><summary>答え</summary>

**2**。手元の `s` を付け替えただけ。`t` は変わらない。

</details>
