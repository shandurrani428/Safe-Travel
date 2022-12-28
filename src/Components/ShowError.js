import { showMessage } from 'react-native-flash-message';

const ShowError = (message) => {

    showMessage({
        message,
        type: 'danger',
        icon: 'danger'
    })
}
export default ShowError;