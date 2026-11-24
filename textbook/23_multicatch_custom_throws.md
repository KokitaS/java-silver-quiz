# 23 multi-catch・カスタム例外・throws

> ひとことで言うと: 似た対応の例外は1つの catch にまとめ、自作の例外は `Exception`(必須処理)か `RuntimeException`(任意)を継承して作る。

読む目安: 9分 / 公式カテゴリ: 6 例外処理

## 基本

### multi-catch(`|` でまとめる)
```java
public class Main {
    public static void main(String[] args) {
        try {
            Object o = "x";
            Integer i = (Integer) o;
        } catch (ClassCastException | NullPointerException e) {   // どちらでも同じ処理
            System.out.println("caught " + e.getClass().getSimpleName());
        }
    }
}
// 出力: caught ClassCastException
```

- `|` で並べた型どうしに**継承関係があるとコンパイルエラー**(例: `IOException | Exception`)。
- multi-catch の変数 `e` は**暗黙の final**(再代入できない)。

### カスタム例外
```java
public class Main {
    static class MyException extends Exception {            // checked(Exception を継承)
        MyException(String message) { super(message); }
    }
    static class MyRuntime extends RuntimeException {       // unchecked
        MyRuntime(String message) { super(message); }
    }

    static void a() throws MyException {                    // checked → throws が必要
        throw new MyException("checked");
    }
    static void b() {                                        // unchecked → throws 不要
        throw new MyRuntime("unchecked");
    }

    public static void main(String[] args) {
        try {
            a();
        } catch (MyException e) {
            System.out.println(e.getMessage());
        }
        try {
            b();
        } catch (MyRuntime e) {
            System.out.println(e.getMessage());
        }
    }
}
// 出力: checked
// 出力: unchecked
```

### throws のルール
- メソッドが投げる可能性のある **checked 例外は `throws` で宣言**(または中で catch)。
- 呼ぶ側は、その checked 例外を **catch するか、自分の `throws` に書く**。`throws` を書いただけでは、呼び出し元の義務はなくならない。
- **オーバーライド**するときは、親が宣言した checked 例外より**広い例外は投げられない**(同じか、子の型、または何も投げない)。unchecked は自由。
- `throws` に書ける・書けないは、投げる例外が checked か unchecked かだけで決まる。

### 例外の上書き
- `catch` から投げた例外も、`finally` の `throw` で**上書きされる**。

```java
public class Main {
    public static void main(String[] args) {
        try {
            try {
                throw new RuntimeException("original");
            } finally {
                throw new IllegalStateException("finally");   // こちらが外へ出る
            }
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
        }
    }
}
// 出力: finally
```

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `catch (A \| B e)` で A が B の親 | コンパイルエラー |
| multi-catch の `e = ...` | コンパイルエラー |
| `throws` を宣言したメソッドを、catch せずに呼ぶ | コンパイルエラー(呼び出し側も義務) |
| unchecked 例外に `throws` | 不要 |
| `extends Exception` のカスタム例外を throws なしで投げる | コンパイルエラー |
| オーバーライドで親より広い checked 例外 | コンパイルエラー |
| `finally` の `throw` | 元の例外を上書き |

## 確認ミニ問題

**Q1.** コンパイルエラーになるのは?

1. `catch (IOException | SQLException e)`
2. `catch (ArithmeticException | NullPointerException e)`
3. `catch (IOException | Exception e)`
4. `catch (RuntimeException e) { }`

<details><summary>答え</summary>

**3**。`IOException` は `Exception` の子。継承関係のある型は multi-catch に書けない。

</details>

**Q2.** `class E extends Exception { }` を、`void m() { throw new E(); }` で投げた結果は?

1. 正常にコンパイルされる
2. コンパイルエラー(`throws E` か try-catch が必要)
3. 実行時エラー
4. 警告のみ

<details><summary>答え</summary>

**2**。`Exception` を継承しているので checked。

</details>

**Q3.** 出力は?
```java
try {
    try { throw new RuntimeException("a"); }
    finally { throw new RuntimeException("b"); }
} catch (RuntimeException e) {
    System.out.print(e.getMessage());
}
```
1. `a`
2. `b`
3. `ab`
4. コンパイルエラー

<details><summary>答え</summary>

**2**。`finally` で投げた例外が、元の例外を上書きする。

</details>
