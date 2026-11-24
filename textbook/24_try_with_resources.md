# 24 try-with-resources

> ひとことで言うと: `try ( ... )` の中で開いたものは、**終わったら自動で閉じてくれる**。閉じる順番は「開いた順の逆」。

読む目安: 8分 / 公式カテゴリ: 6 例外処理 / 弱点: AutoCloseable が必要・close の順序

## 基本

```java
public class Main {
    static class Res implements AutoCloseable {       // AutoCloseable を実装したものだけ使える
        private final String name;
        Res(String name) { this.name = name; System.out.println("open " + name); }
        public void close() { System.out.println("close " + name); }
    }

    public static void main(String[] args) {
        try (Res a = new Res("A"); Res b = new Res("B")) {
            System.out.println("body");
        } finally {
            System.out.println("finally");
        }
    }
}
// 出力: open A
// 出力: open B
// 出力: body
// 出力: close B
// 出力: close A
// 出力: finally
```

### ルール
- `try ( )` の中に書けるのは **`AutoCloseable`(または `Closeable`)を実装したもの**だけ。`String` などを書くと**コンパイルエラー**。
- 閉じる順番は**宣言と逆順**(B → A)。
- 自動の `close()` は、**`catch` や `finally` より先に**実行される。
- `try` 本体と `close()` の両方で例外が出たら、**本体の例外が主**で、`close()` の例外は「抑制された例外(suppressed)」として添えられる。
- 資源の変数は**暗黙の final**で、`try` ブロックの**外では使えない**。
- Java 9 以降は、すでに宣言した(実質 final の)変数を `try (res) { ... }` とも書ける。
- `AutoCloseable.close()` は `throws Exception` を宣言しているので、そのまま使うと、呼ぶ側は `catch` か `throws` が必要。(自作クラスで `close()` の `throws` を外せば不要。)
- `catch` を付けるなら、その `try` 本体と `close()` が投げる例外も受け止められる。

### 例外が出たときの順序
```java
public class Main {
    static class Res implements AutoCloseable {
        public void close() { System.out.println("close"); }
    }
    public static void main(String[] args) {
        try (Res r = new Res()) {
            System.out.println("body");
            throw new RuntimeException("error");
        } catch (RuntimeException e) {
            System.out.println("catch " + e.getMessage());
        } finally {
            System.out.println("finally");
        }
    }
}
// 出力: body
// 出力: close
// 出力: catch error
// 出力: finally
```

順序は **本体 → close → catch → finally**。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `try (String s = "x")` | コンパイルエラー(AutoCloseable ではない) |
| 閉じる順番 | 宣言の**逆順** |
| close と catch の順番 | **close が先**、その後に catch |
| 資源変数をブロックの外で使う | コンパイルエラー |
| 資源変数の再代入 | コンパイルエラー(暗黙の final) |
| `catch` も `finally` もない try-with-resources | **有効**(通常の try と違い、どちらも不要) |
| 本体と close の両方で例外 | 本体の例外が主、close は suppressed |

## 確認ミニ問題

**Q1.** コンパイルエラーになるのは?

1. `try (Res r = new Res()) { }`(Res は AutoCloseable 実装)
2. `try (String s = "x") { }`
3. `try (Res a = new Res(); Res b = new Res()) { }`
4. `try (Res r = new Res()) { } finally { }`

<details><summary>答え</summary>

**2**。`String` は `AutoCloseable` ではない。

</details>

**Q2.** `try (Res a = new Res("A"); Res b = new Res("B")) { }` で `close` が呼ばれる順番は?

1. A → B
2. B → A
3. 同時
4. 呼ばれない

<details><summary>答え</summary>

**2**。宣言と逆の順番で閉じる。

</details>

**Q3.** 本体で例外が起き、`catch` があるとき、`close()` と `catch` の実行順は?

1. `catch` → `close`
2. `close` → `catch`
3. `close` だけ
4. `catch` だけ

<details><summary>答え</summary>

**2**。資源は `catch` より先に閉じられる。

</details>
