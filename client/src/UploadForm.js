import React from "react";
import { useMutation, gql } from "@apollo/client";

const UPLOAD_FILE = gql`
	mutation uploadFile($file: Upload!) {
		uploadFile(file: $file) {
			url
		}
	}
`;

export default function UploadForm() {
	const [uploadFile] = useMutation(UPLOAD_FILE, {
		onCompleted: (data) => console.log(data),
	});

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		uploadFile({ variables: { file } });
	};
	return (
		<div>
			<h1>Upload File</h1>
			<input type="file" onChange={handleFileChange} />
		</div>
	);
}
