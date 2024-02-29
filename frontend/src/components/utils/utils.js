
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export const Alert = (title,text, icon) => {
    return Swal.fire({
        title,
        text,
        icon,
        showConfirmButton: false,
    })
}

export const ErrorAlert = (message) => {
    return toast.error(message, {
        position: "top-right"
    })
}

export const SuccessAlert = (message) => {
    return toast.success(message, {
        position: "top-right"
    })
}

export const CookieName = 'ssid'

export const UserRole = [
    {
        role: 'user',
        url: '/profile'
    },
    {
        role: 'admin',
        url: '/admin'
    },
]