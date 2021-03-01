<template>
    <div class="content">
        <div class="card">
            <div>

            </div>
            <div class="rightBox">
                <div class="loginBox" :class="{left:activeMove}">
                    <h3>Sign Up</h3>
                    <w-input title="用户名" placeholder="请输入QQ邮箱 / 账号" v-model="userName"></w-input>
                    <w-input type="password" @keyup.enter.native="loginBtn" title="密码" placeholder="输入您的密码" v-model="password"></w-input>
                    <div style="margin-top:20px;">
                        <div class="zc" @click="activeMove = true">
                            没有账号？立即注册
                        </div>
                        <button class="btn" @click="loginBtn">
                            登 录
                        </button>
                    </div>
                </div>
                <div class="zcBox" :class="{right:activeMove}">
                    <div class="iconLoad">
                        <img v-if="imgurl" :src="imgurl" alt="">
                        <input type="file" id="headIcon" class="headIcon" />
                        <div v-if="!imgurl" class="hint">
                            头像
                        </div>
                        <h5-cropper
                                ref="cropper"
                                hide-input
                                :option="option"
                                @canceltailor='chanel'
                                @getblobData="getblobData"
                                @getFile="save"
                        ></h5-cropper>
                    </div>

                    <w-input title="用户名" placeholder="输入您的昵称" v-model="userName1"></w-input>
                    <w-input type="password" title="密码" v-model="password1"></w-input>
                    <w-input type="password" title="确认密码" v-model="password2"></w-input>
                    <w-input title="QQ邮箱" placeholder="邮箱将作为用户登录账号" v-model="email"></w-input>
                    <div>
                        <button class="btn codebtn" @click="judegeUserName(email,1)" :class="{disbled:codeTxt!='获取证码'?true:false}">
                            {{codeTxt}}
                        </button>
                        <div class="code">
                            <w-input v-model="code" placeholder="验证码"></w-input>
                        </div>
                    </div>

                    <div style="margin-top:20px;">
                        <div class="zc" @click="activeMove = false">
                            去登录
                        </div>
                        <button class="btn" @click="judegeUserName(userName1,2)">
                            立即注册
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        mapMutations
    } from 'vuex'
    import wInput from '../../components/wInput'
    import H5Cropper  from 'vue-cropper-h5'
    import lrz from "lrz";
    export default {
        components: {
            wInput,H5Cropper
        },
        data() {
            return {
                option:{
                    url:'',
                },
                userName: '',
                password: '',

                userName1: '',
                password1: '',
                password2: '',
                email: '',
                code: '',
                imgurl:"",
                active: false,
                active1: false,
                active2: false,
                zc: false,
                login: false,
                activeMove: false,
                codeTxt: '获取证码',
                setTime: '',
                isview:"",
                query:{}
            }
        },
        mounted(){
            let query = this.$route.query
            if(query.hasOwnProperty("url")){
                this.query = query
            }
            let _this = this
            document.getElementById("headIcon").onchange = function(e){
                setTimeout(() => {
                    _this.$refs.cropper.loadFile(this.files[0])
                }, 0);
            }
        },
        methods: {
            // 将用户信息保存在vuex里面
            ...mapMutations(["setToast"]),
            // 取消
            chanel() {
                this.option.img = ''
                this.blob = ''
            },
            getblobData(data){
               //console.log(data);
            },
            save(file) {
                const obj = {
                    file: file,
                }
                let _this = this
                lrz(obj.file).then(function (rst) {
                    // 处理成功会执行
                    obj.file = rst.file
                    _this.$uploadImg("http://39.99.193.63:8889/api/upload",obj.file).then(data=>{
                        _this.imgurl = data.path
                        _this.chanel()
                        _this.setToast({show:true,icon:"success",title:"上传成功"})
                    }).catch(err=>{
                        _this.setToast({show:true,icon:"warning",title:"上传失败"})
                    })
                }).catch(function (err) {})
            },
            getCode() {
                if (this.codeTxt !== "获取证码") return;
                let params = {
                    emailId: this.email
                }
                if (this.email == '') {
                    this.setToast({show:true,icon:"warning",title:"请输入验证码"})
                    return;
                }
                let i = 120;
                this.setTime = setInterval(() => {
                    i--;
                    if (i >= 1) {
                        this.codeTxt = `${i} 秒`
                    } else {
                        window.clearInterval(this.setTime);
                        this.codeTxt = "获取证码"
                    }
                }, 1000)
                this.$post(this.$api.getCode, params).then((data) => {

                }).catch(() => {
                    this.codeTxt = "获取证码"
                    window.clearInterval(this.setTime);
                });
            },

            /*验证邮箱昵称*/
            judegeUserName(name,type=1){
                if (name == ""){
                    this.setToast({show:true,icon:"warning",title:"请输入用户名"})
                    return
                }
                this.$post(this.$api.judegeUserName, {userName:name}).then((data) => {
                    if(type == 1){
                        this.getCode()
                    }else{
                        this.addNewUser()
                    }
                })
            },
            //上传图片
            fileChange(val){
                this.imgurl = val[0];
            },
            //注册用户
            addNewUser() {
                if (this.password1 != this.password2) {
                    this.setToast({show:true,icon:"warning",title:"两次密码不一致"})
                    return;
                }
                let params = {
                    userName: this.userName1,
                    passWord: this.password1,
                    Email: this.email,
                    code: this.code,
                    imgurl:this.imgurl
                }
                this.$post(this.$api.addNewUser, params).then((data) => {
                    this.userName = this.userName1;
                    this.password = this.password1
                    this.loginBtn();
                });
            },

            loginBtn() {
                let params = {
                    userName: this.userName,
                    passWord: this.password
                }
                if (this.userName == "") {
                  this.setToast({show:true,icon:"warning",title:"请输入用户名"})
                } else if (this.password == "") {
                  this.setToast({show:true,icon:"warning",title:"请输入密码"})
                } else {
                    this.$post(this.$api.login, params).then((data) => {
                        if (data.isLogin) {
                            this.setToast({show:true,icon:"success",title:'登录成功' + data.data[0].userName})
                            let url = this.query.url.split('?')[0]
                            window.location.href = `${url}?token=${data.token}`
                        } else {
                            this.setToast({show:true,icon:"warning",title:data.msg})
                        }
                    });
                }

            }
        }
    }
</script>
<style scoped lang="less">
    .content {
        display: flex;
        justify-content: center;
        align-items: Center;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        position: relative;
    }

    .content::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: inherit;
        filter: blur(8px);

    }

    .card {
        background: url("../../../static/images/l_bg2.jpg");
        background-size: cover;
        background-color: white;
        background-position: center center;
        box-shadow: 0 0 40px black;
        z-index: 15;

        & > div {
            float: left;
            height: 600px;
        }

        & > div:nth-child(1) {
            width: 600px;
            transition: all 0.36s ease;
        }

        & > div:nth-child(2) {
            width: 370px;
            background: rgba(0, 0, 0, 0.6);

            & > div {
                margin-top: 100px;
                padding: 0 60px;
                font-family: "Times New Roman";

                h3 {
                    color: white;
                    font-size: 22px;
                }
            }

        }
    }

    @media screen and (max-width: 1005px) {
        .card > div:nth-child(1) {
            width: 0;
        }
    }

    @inputColor: #b1b1b1;

    .zc {
        float: right;
        font-size: 12px;
        color: @inputColor;

        &:hover {
            cursor: pointer;
            color: white;
        }
    }

    .btn {
        font-size: 12px;
        width: 100px;
        line-height: 30px;
        text-align: center;
        color: @inputColor;
        border: 1px solid @inputColor;
        transition: all 0.46s ease;
        background: none;
    }

    .btn:hover {
        color: white;
        border-color: white;
        cursor: pointer;
    }

    .disbled {
        cursor: not-allowed !important;
    }

    .code {
        width: 140px;
    }

    .codebtn {
        float: right;
        line-height: 25px;
        width: 80px;
        margin-top: 5px;

    }

    .rightBox {
        position: relative;
        overflow: hidden;

        .loginBox {
            position: absolute;
            width: 250px;
            left: 0;
            transition: all 0.36s ease;

            &.left {
                left: -370px;
            }
        }

        .zcBox {
            position: absolute;
            width: 250px;
            left: 370px;
            top: -80px;
            transition: all 0.46s ease;

            &.right {
                left: 0;
            }
        }
    }
    .iconLoad{
        border: 2px dashed #ff7268;
        width: 80px;
        border-radius: 6px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        height: 80px;
        img{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        .hint{
          position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            color: white;
            text-align: justify;
        }
        .headIcon{
            z-index: 99;
            width: 80px;
            height: 80px;
            opacity: 0;
        }
    }

</style>
