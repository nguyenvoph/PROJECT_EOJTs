import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const actionSuccess = (Message) => toast.success(Message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
});

const actionFail = (Message) => toast.error(Message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,

});

const actionWarning = (Message) => toast.warning(Message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,

});

const actionInfo = (Message) => toast.info(Message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,

});

const Toastify = {
    actionSuccess,
    actionFail,
    actionWarning,
    actionInfo
}

export default Toastify;