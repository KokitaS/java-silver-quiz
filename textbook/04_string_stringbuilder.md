# 04 String・StringBuilder・連結の評価順

> ひとことで言うと: `String` は書き換えられない(新しい文字列が返る)。`StringBuilder` は書き換えられる。

読む目安: 10分 / 公式カテゴリ: 2 基本データ型・文字列 / 弱点: 連結の評価順・immutable

## 基本

### String は immutable(不変)
印刷済みの紙に「消しゴム」は使えず、**コピーを新しく作って直す**イメージです。メソッドを呼んでも元の `String` は変わりません。

```java
public class Main {
    public static void main(String[] args) {
        String s = "Hello";
        s.toUpperCase();              // 結果を受け取っていない → s は変わらない
        System.out.println(s);
        s = s.toUpperCase();          // 再代入して初めて反映
        System.out.println(s);
        String t = "Java";
        System.out.println(t.substring(1, 3));   // 開始以上・終了未満
        System.out.println(t.indexOf("z"));      // 見つからないと -1
    }
}
// 出力: Hello
// 出力: HELLO
// 出力: av
// 出力: -1
```

主なメソッド(`s = "Java"`):

| メソッド | 結果 |
|---|---|
| `length()` | 4 |
| `charAt(0)` | `'J'` |
| `substring(1)` | `"ava"` |
| `substring(1, 3)` | `"av"`(**終了位置は含まない**) |
| `indexOf("a")` | 1 |
| `replace("a", "o")` | `"Jovo"` |
| `toUpperCase()` | `"JAVA"` |
| `trim()` / `strip()` | 前後の空白除去 |
| `isEmpty()` / `isBlank()` | `length()==0` / 空白だけでも true |

### == と equals、文字列プール
- `"hello" == "hello"` は **true**(リテラルはプールで共有)。
- `new String("hello") == "hello"` は **false**(別オブジェクト)。値の比較は `equals`。
- `equalsIgnoreCase` は大文字小文字を無視。

### 連結(+)の評価順
**左から順に**計算します。文字列に出会うまでは数値の足し算、出会ったら以降はすべて連結です。

```java
public class Main {
    public static void main(String[] args) {
        int x = 1, y = 2, z = 3;
        System.out.println(x + y + "hello" + z);   // (1+2) → 3 → "3hello" → "3hello3"
        System.out.println("" + x + y + z);         // 最初から文字列 → "123"
        System.out.println("sum=" + x + y);         // "sum=12"
        System.out.println("sum=" + (x + y));       // "sum=3"
        System.out.println('A' + 1);                // 'A' は 65 → 66
        System.out.println("" + 'A' + 1);           // "A1"
        String n = null;
        System.out.println(n + " x");               // "null x"(NPE にならない)
    }
}
// 出力: 3hello3
// 出力: 123
// 出力: sum=12
// 出力: sum=3
// 出力: 66
// 出力: A1
// 出力: null x
```

### StringBuilder は mutable(可変)
```java
public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Hello");
        sb.append(" World");       // 自分自身を書き換える
        sb.insert(5, ",");
        System.out.println(sb);
        sb.reverse();
        System.out.println(sb);
    }
}
// 出力: Hello, World
// 出力: dlroW ,olleH
```

- `append`・`insert`・`delete`・`reverse` は**元のオブジェクトを変更**する。
- メソッドに渡して中身を変えると、**呼び出し元にも反映**される(参照渡しのため)。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `s.concat("x");` だけ書く | `s` は変わらない(戻り値を使う) |
| `substring(1, 3)` | 1番目から**2文字**(終了位置は含まない) |
| `1 + 2 + "a"` と `"a" + 1 + 2` | `"3a"` と `"a12"` |
| `'A' + 1` | 66(`char` は数値として足される) |
| `"" + 'A' + 1` | `"A1"` |
| `null + "x"` | `"nullx"`(例外にならない) |
| `null` の `String` に `.length()` | NullPointerException |
| `new String("a") == "a"` | false |
| `"hello".contains("H")` | false(大文字小文字を区別) |

## 確認ミニ問題

**Q1.** 出力は?
```java
int a = 1, b = 2;
System.out.println(a + b + "x" + a + b);
```
1. `3x3`
2. `3x12`
3. `12x12`
4. `3x3`ではなくコンパイルエラー

<details><summary>答え</summary>

**2**。`a + b` は先に 3。その後 `"3x"` に文字列連結で `1`、`2` が続いて `3x12`。

</details>

**Q2.** 出力は?
```java
String s = "abc";
s.toUpperCase();
s.concat("d");
System.out.println(s);
```
1. `ABCd`
2. `ABC`
3. `abcd`
4. `abc`

<details><summary>答え</summary>

**4**。どちらも戻り値を受け取っていない。`String` は不変。

</details>

**Q3.** `"Hello".substring(1, 3)` の結果は?

1. `el`
2. `ell`
3. `He`
4. `Hel`

<details><summary>答え</summary>

**1**。1番目(`e`)から3番目の手前(`l`)まで。`"el"`。

</details>
