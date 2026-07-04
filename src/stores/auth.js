import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore('auth', ()=>{
    const user = ref (JSON.parse(sessionStorage.getItem('empuser') || 'null'))

    const isAuthenticated = computed (()=> !!user.value)
    const isAdmin = computed(()=> user.value?.role === 'admin')
    const isHR = computed(()=> user.role?.role === 'hr')
    const isEmployee = computed(()=> user.role?.role === 'employee')
    const isAdminOrHR = computed(()=> isAdmin.value || isHR.value)

    function login(userData){
        user.value = userData
        sessionStorage.setItem('empuser', JSON.stringify(userData))
    }
    function logout(){
        user.value = null
        sessionStorage.removeItem('empuser')
    }
    return{
        user,
        isAuthenticated,
        isAdmin,
        isHR,
        isEmployee,
        isAdminOrHR,
        login,
        logout,
    }
})