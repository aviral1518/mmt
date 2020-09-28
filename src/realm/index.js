import * as Realm from "realm";
import userSchema from "./userSchema";

function connect(cb) {
	Realm.open({
		schema: [userSchema],
		schemaVersion: 7,
	}).then(cb);
}

export default connect;