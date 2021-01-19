const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");

const {
	GraphQLUpload, // The GraphQL "Upload" Scalar
	graphqlUploadExpress, // The Express middleware.
} = require("graphql-upload");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

function generateRandomString(length) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

const typeDefs = gql`
	type File {
		url: String!
	}

	type Query {
		hello: String!
	}

	type Mutation {
		uploadFile(file: Upload!): File!
	}
	scalar Upload
`;

const resolvers = {
	Query: {
		hello: () => "Hello friend...",
	},
	Mutation: {
		uploadFile: async (parent, { file }) => {
			const { createReadStream, filename } = await file;

			const { ext } = path.parse(filename);
			const randomName = generateRandomString(12) + ext;

			const stream = createReadStream();
			const pathName = path.join(
				__dirname,
				`/public/images/${randomName}`
			);
			await stream.pipe(fs.createWriteStream(pathName));

			return {
				url: `http://localhost:4000/images/${randomName}`,
			};
		},
	},
	Upload: GraphQLUpload,
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	uploads: false,
});

const app = express();
app.use(graphqlUploadExpress());
app.use(express.static("public"));
app.use(cors());
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () => {
	console.log(`🚀 Server ready at http://localhost:4000`);
});
