<script setup>
import { ref } from 'vue';
import { passwordLogin } from '@/api/http';
import { useRouter } from 'vue-router';

const router = useRouter();
const password = ref('');

const login = async () => {
    var auth = await passwordLogin(password.value);
    console.log(auth);
    if (auth === 1) {
        router.push('/crud');
        alert("登录成功！")
    }
    else alert("密码错误！");
    password.value = '';
};
</script>

<template>
    <div class="login">
        <el-form>
            <el-form-item>
                <el-input v-model="password" style="width: 240px" type="password" placeholder="Please enter the password"
                    show-password />
            </el-form-item>
            <el-form-item>
                <el-button @click="login" type="primary" style="width: 240px">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
.login {
    margin-top: 12%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>