import sys
from newspaper import Article

srcCode = sys.argv[1:]
article = Article('')
article.set_html(srcCode);
article.parse()
article.nlp()

for k in article.keywords:
    print k
