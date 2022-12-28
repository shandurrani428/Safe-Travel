import { showMessage } from 'react-native-flash-message';

const ShowSuccess = (message) => {

    showMessage({
        message,
        type: 'success',
        icon: 'success'
    })
}
export default ShowSuccess;