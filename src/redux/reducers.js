import { AUTHENTICATE_USER} from "./types";

const initialState = {
	user: {
		signInMethod: "EMAIL",
		avatarSource: "",
		name: "",
		nameAbbr: "",
		phone: "",
		email: "",
		password: "",
	},
};

function applyAuthenticateUser(state, user) {
	const {
		signInMethod,
		avatarSource,
		name,
		nameAbbr,
		phone,
		email,
		password,
	} = user;

	return {
		user: {
			signInMethod,
			avatarSource,
			name,
			nameAbbr,
			phone,
			email,
			password,
		},
	};
}

function reducer(state = initialState, action) {
	switch (action.type) {
		case AUTHENTICATE_USER:
			return applyAuthenticateUser(state, action.user);
		default:
			return state;
	}
}

export default reducer;