import { useToast } from "vue-toast-notification";

class Toast
{
    constructor()
    {
        this.toast = useToast();
    }

    success(message)
    {
        this.toast.success(message,{position:'top-right'});
    }

    error(message)
    {
        this.toast.error(message,{position:'top-right'});
    }

    warning(message)
    {
        this.toast.warning(message,{position:'top-right'});
    }

    info(message)
    {
        this.toast.info(message,{position:'top-right'});
    }
}

export default new Toast();