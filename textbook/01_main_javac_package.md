# 01 main・javac/java・package/import

> ひとことで言うと: `.java` を `javac` で `.class` に変換し、`java クラス名` で動かす。入口は `main`。

読む目安: 8分 / 公式カテゴリ: 1 Java概要

## 基本

### 動かす2ステップ
料理に例えると、`.java` が**レシピ**、`javac` が**レシピを機械語の手順書に直す作業**、`java` が**実際に調理する人(JVM)**です。

```
javac Hello.java    ← Hello.class ができる
java Hello          ← 拡張子も .class も書かない
```

- `javac` に渡すのは**ファイル名(拡張子あり)**。`java` に渡すのは**クラス名(拡張子なし)**。
- Java 11 以降は `java Hello.java` でソースを直接実行もできる(コンパイルが裏で走る)。
- JDK ⊃ JRE ⊃ JVM。JDK には `javac` などの開発ツールが入っている。

### main メソッド
プログラムの入口は決まった形のメソッドです。

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
        System.out.println("args=" + args.length);
    }
}
// 出力: Hello
// 出力: args=0
```

- `public static void main(String[] args)` が基本形。
- `static public` と順序を入れ替えても OK。`String... args` や `String args[]` も OK。
- 引数なしで実行しても `args` は `null` ではなく**長さ0の配列**。
- 戻り値が `void` でない、`static` がない、`public` がない場合は、コンパイルは通るが `java` で実行するとエラー。

### package と import
```java
package com.example;          // ① 最初(コメント除く)。ファイルに1つだけ
import java.util.ArrayList;   // ② package の次
import java.util.*;           // ワイルドカードも可

public class Main { }         // ③ その後にクラス
```

- 順番は **package → import → クラス**。
- `java.lang`(`String`、`System`、`Math` など)は**自動で import される**。
- 同じクラス名が衝突する(例: `java.util.Date` と `java.sql.Date`)場合、`Date` と書くとあいまいでコンパイルエラー。片方を完全修飾名で書く。
- 1つの `.java` に `public` クラスは**1つだけ**で、ファイル名と**一致**させる。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `java Main.class` | エラー。`java Main` と書く |
| `import java.util.*;` で `java.util.regex` も使える? | **使えない**。`*` はサブパッケージを含まない |
| `String` を使うのに import が要る? | 要らない(`java.lang` は自動) |
| `import` が `package` より前 | コンパイルエラー |
| `public class A` を `B.java` に保存 | コンパイルエラー |
| 引数なしで実行したときの `args` | `null` ではなく空配列(`length` は 0) |
| `static public void main` | 有効 |

## 確認ミニ問題

**Q1.** `Hello.java` をコンパイルして実行するコマンドの組み合わせで正しいものは?

1. `javac Hello` → `java Hello.class`
2. `javac Hello.java` → `java Hello`
3. `java Hello.java` → `javac Hello`
4. `javac Hello.class` → `java Hello`

<details><summary>答え</summary>

**2**。`javac` は拡張子つきのファイル名、`java` は拡張子なしのクラス名。(`java Hello.java` はソース直接実行なので3は逆。)

</details>

**Q2.** 次のうち、コンパイルエラーになるのはどれ?

1. `import java.util.*;` の後ろで `ArrayList` を使う
2. `import` 文を `package` 文の後ろに書く
3. `package` 文を `import` 文の後ろに書く
4. `String` を import せずに使う

<details><summary>答え</summary>

**3**。順番は package → import → クラス。4 は `java.lang` なので import 不要で OK。

</details>

**Q3.** `import java.util.*;` だけで使えるものは?

1. `java.util.regex.Pattern`
2. `java.util.ArrayList`
3. `java.io.File`
4. `java.util.concurrent.Executors`

<details><summary>答え</summary>

**2**。ワイルドカードは直下のクラスだけ。サブパッケージ(regex、concurrent)は対象外。

</details>
