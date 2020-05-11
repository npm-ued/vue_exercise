<template>
  <div class="loginBox">
    <div class="loginTitle">{{$t('SystemName')}}</div>
    <div class="loginMain clearfix">
      <div class="loginLeft">
        <img src="../../assets/images/login/loginLeft.png" alt="">
      </div>
      <form class="loginForm" action="/login" method="post">
        <div class="loginFormTitle">{{$t('LoginModule.AdministratorLogin')}}</div>
        <p class="showMsg" v-show="showErrorMessage">{{ErrorMessage}}</p>
        <div class="loginGroup">
          <div class="loginIcon">
            <img src="../../assets/images/login/userName.png" alt="">
          </div>
          <input type="text" v-model.trim="mobileNumber" class="loginControl" autocomplete="off" :placeholder="`${$t('Common.PleaseEnter')}${$t('LoginModule.MobileNumber')}`">
        </div>
        <div class="loginGroup">
          <div class="loginIcon">
            <img src="../../assets/images/login/pwd.png" alt="">
          </div>
          <input type="text" v-model.trim="code" class="loginControl" autocomplete="off" :placeholder="`${$t('Common.PleaseEnter')}${$t('LoginModule.SMSVerificationCode')}`">
          <Button type="primary" v-if="codeStatus" class="codeBtn" @click="sendCode">{{$t('LoginModule.GetCode')}}</Button>
          <button type="default" v-else class="codeBtnDisable" disabled>{{codeText}}{{$t('LoginModule.Resend')}}</button>
        </div>
        <div class="langWrap">
          <a @click="changeLanguage" class="langLink">{{$t('CurrentLan')}}: {{localeLanguage}}</a>
          <Button v-permissions="['super_admin_user']" type="primary">确认还款</Button>
        </div>
        <div class="form-group">
          <input type="button" :value="`${$t('LoginModule.Login')}`" class="loginBtn" @click="login" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import jsonwebtoken from 'jsonwebtoken';
import store from '../../store';
const getAuthCodeUrl = '/sail/v1/admin_user/auth_code';
const loginUrl = '/sail/v1/admin_user/login';
let systemLan = 'en-US';
const navigatorLan = navigator.language; // 获取浏览器的语言设置
if (navigatorLan.indexOf('zh') == 0) {
  systemLan = 'zh-CN'; // 汉语默认设置成中文简体
}
if (localStorage.getItem('locale')) {
  systemLan = localStorage.getItem('locale');
}
export default {
  name: 'login',
  data () {
    return {
      localeLanguage: systemLan === 'en-US' ? 'EN-US' : '中文',
      showErrorMessage: false,
      ErrorMessage: '',
      mobileNumber: '', // 用户手机号
      code: '', // 手机验证码
      codeText: 60,
      codeStatus: true, // 是否可以获取验证码
      timer: null,
      loginStatus: true // 防止二次提交
    };
  },
  beforeDestroy () {
    clearInterval(this.timer); // 清空timmer
  },
  methods: {
    // 当前语言切换
    changeLanguage () {
      if (this.$i18n.locale === 'en-US') {
        this.$i18n.locale = 'zh-CN';
        this.localeLanguage = '中文';
      } else if (this.$i18n.locale === 'zh-CN') {
        this.$i18n.locale = 'en-US';
        this.localeLanguage = 'EN-US';
      }
      localStorage.setItem('locale', this.$i18n.locale);
    },
    // 发送验证码
    sendCode () {
      this.showErrorMessage = false;
      if (!this.mobileNumber) {
        this.showErrorMessage = true;
        this.ErrorMessage = `${this.$t('Common.PleaseEnter')}${this.$t('LoginModule.MobileNumber')}`;
        return false;
      }
      const params = { mobile: this.mobileNumber };
      this.$ajax.post(getAuthCodeUrl, params).then((res) => {
        if (res.status == 200) {
          // 获取成功倒计时
          this.countDown(); // 倒计时
          // 倒计时
        } else {
          this.showErrorMessage = true;
          this.ErrorMessage = res.message;
        }
      });
    },
    // 倒计时
    countDown () {
      this.codeStatus = false;
      this.codeText = 60;
      this.timer = window.setInterval(() => {
        if (this.codeText > 1) {
          this.codeText--;
        } else {
          window.clearInterval(this.timer); // 恢复按钮发送验证码先清除timer
          this.codeStatus = true;
        }
      }, 1000);
    },
    testPromise (num) {
      return new Promise((resolve, reject) => {
        window.setTimeout(function () {
          if (num == 0) {
            reject(new Error('null'));
          } else {
            resolve(num);
          }
        }, 1000);
      });
    },
    // 登录
    login () {
      this.showErrorMessage = false;
      if (!this.mobileNumber) {
        this.showErrorMessage = true;
        this.ErrorMessage = `${this.$t('Common.PleaseEnter')}${this.$t('LoginModule.MobileNumber')}`;
        return false;
      }
      if (!this.code) {
        this.showErrorMessage = true;
        this.ErrorMessage = `${this.$t('Common.PleaseEnter')}${this.$t('LoginModule.SMSVerificationCode')}`;
        return false;
      }
      const params = { mobile: this.mobileNumber, code: this.code };
      if (!this.loginStatus) {
        return;
      }
      this.loginStatus = false;
      // this.$ajax.post(loginUrl, params).then((res) => {
      //   this.loginStatus = true;
      //   if (res.status == 200) {
      // 临时永久token
      const TOKEN = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJ1bmFtZVwiOlwiYWRtaW51c2VyXzcwNzUyODQyNDM2ODkwMjE0NFwiLFwicGVybWlzc2lvbnNcIjpcInN1cGVyX2FkbWluX3VzZXIsbG9hbl9vcmRlcixsb2FuX29yZGVyX3NldHRsZSxsb2FuX3JlcXVlc3Qscmlza19hcHByb3ZlLHByb2plY3RfYXBwcm92ZSxwcm9qZWN0X2luZm8sdXNlcl9pbmZvXCJ9IiwiZXhwIjoxNTk3NjUzNzg4fQ.JkEVxOSY0n21znDE9s2iPCzWKCVqF050289xJRwb0RVBY_ewewMHAAWNCpMbo_X6U86Q_6-dHg4DFV0XjoCKR1AKwcPNJBRj5xhAMKf8p8gNva70vu0gJ7K9IcIBIPcrIrCdNnDgrEf-88IffENcbmih3p97NZhXwkOEzN0CyGF68j9w0iqgGTYmjmEpY9s-1eaR6cdQePAITmSk45Y9PEkGkxfcT-Byb31ob3booMCvYC2quYsnF_1UvNaFdzeFK91OBuMBl3hLfKeAK9-ID9VbGWtq8N6mL9Pwzau45rian7UU1cpZN3yp-btnVfXGr15_m-VEVE_Bifg3II3lJQ';
      localStorage.setItem('JWT_TOKEN', TOKEN); // JWT token 本地存储
      const userInfoString = jsonwebtoken.decode(TOKEN).sub;
      const userInfo = JSON.parse(userInfoString);
      const { permissions } = userInfo;
      store.dispatch('setUserPermissions', permissions);
      localStorage.userInfo = JSON.stringify(jsonwebtoken.decode(TOKEN)); // 解析用户token
      this.$router.push('/');
      // 获取权限
      //   } else {
      //     this.showErrorMessage = true;
      //     this.ErrorMessage = res.message;
      //   }
      // }, (err) => {
      //   this.loginStatus = true;
      //   console.log(err);
      //   this.$router.push('/');
      // }).then(() => {
      //   this.loginStatus = true;
      //   this.$router.push('/');
      // });
    }
  }
};
</script>

<style lang="less">
html {
  overflow: auto !important;
}
.loginBox {
  background: url('../../assets/images/login/loginBg.jpg') no-repeat center;
  background-size:100% 100%;
  background-color: #e6e6e6;
  padding-top: 40px;
  width: 100%;
  height: 100%;
  min-height: 660px;
  position: absolute;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
}

.loginTitle {
  font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
  line-height: 80px;
  font-style: normal;
  font-size: 52px;
  color: #1c4cff;
  text-align: center;
}

.loginFormTitle {
  font-size: 29px;
  color: #000000;
  font-style: normal;
  text-align: center;
  margin-bottom: 40px;
  letter-spacing: 4px;
}
.loginMain{
  width: 900px;
  height: 480px;
  /* border-radius:5px; */
  /* box-shadow:0px 10px 20px #bfc5da; */
  margin: 0 auto;
  margin-top:40px;
  /* background:#fff */
}
.loginLeft{
  float:left;
  background:#e0e0e0;
  border-top-left-radius: 5px;
  border-bottom-left-radius:5px;
  padding:130px 61px;
  height: 481px;
  box-sizing: border-box;
}
.loginLeft img{
  display: block;
  width: 328px;
}
.loginForm {
  float: right;
  position: relative;
  /* margin: 80px auto; */
  width: 450px;
  height: 481px;
  padding: 50px 25px;
  text-align: center;
  background: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.loginGroup{
  margin:20px;
  padding:10px 5px;
  border-bottom:1px solid #1c4cff;
  text-align:left;
  position: relative;
}
.loginIcon {
  position: absolute;
  width: 30px;
  height: 30px;
  text-align: center;
}
.loginControl{
  border:none;
  outline: none;
  margin-left:40px;
  font-size:20px;
  line-height:30px;
  vertical-align:middle;
  width: 260px;
}
.showMsg {
  position: absolute;
  font-size: 12px;
  color: #fff;
  text-align: center;
  line-height: 20px;
  width: 100%;
  color:red;
  left: 0;
  top: 100px;
}

.loginBtn {
  display: block;
  width: 168px;
  line-height:48px;
  border-radius:24px;
  text-align: center;
  background:#2d5afc;
  color:#fff;
  border:none;
  outline: none;
  margin:50px auto;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
  cursor: pointer;
  font-size: 18px;
}
.langLink {
  color: #1c4cff;
  font-size: 14px;
}
.codeBtn {
  position: absolute;
  right: 0;
  font-size: 14px;
  background-color: #2d5afc;
}

.codeBtnDisable {
  width: 90px;
  text-align: center;
  position: absolute;
  right: 0;
  height: 30px;
  border-radius: 3px;
  border: 1px solid #ccc;
  color: #ccc;
}
.clearfix{zoom:1;}
.clearfix:after{ clear:both; display:block; content:"."; height:0; visibility:hidden;}
</style>
