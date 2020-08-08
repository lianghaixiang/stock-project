# stock-project
股票交易模型的实现以及在小程序上的应用

## 数据提取与模型训练
  1. notebook 文件包含股票数据提取和模型训练的demo。
  2. 股票数据是调用tushare 接口，需要预先注册一个得到token，就可通过接口调用。
  3. 模型是采用lstm模型训练，特征是使用过去7天的股票的最高价、最低价、收盘价作为特征，第二天的收盘价作为label，测试集上的准确率约61.2%。
 
## 微信小程序
  小程序界面比较简单，可输入任意任意股票代码，通过调用证券之星接口获取股票数据，预测股票的涨跌和涨幅。
  小程序界面：
  ![小程序界面](https://github.com/weishao6hao/stock-project/blob/master/wx-miniprogram.jpeg)
  
