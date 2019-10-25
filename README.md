# RedmineLink

指定しておいたベース URL にファイルパス、リビジョン番号、選択中の行番号を入れて Redmine のリンクを作成します。

## 使い方

- settings.json に redminelink.baseText と追加しそこにベースのテキストを追加します。(下記の例を参照して下さい)
- {FP}:ファイルパス, {RN}:リビジョン番号, {LN}:行番号をテキストに挿入すると実行時にはそれらが挿入されます。

## settings.json 例

```JSON
"redmineLink.baseUrl": [
    {
        "title" : "url1",
        "url" : "http://foo/bar/repository/revisions/{RN}/entry/{FP}#L{LN}",
    },
    {
        "title" : "url2",
        "url" : "source:\"{FP}@{RN}#L{LN}\"",
    }
]
```
