# Udagram

Udagram is a fullstack application built on Node.js, Express, Angular and Ionic. The application allows users to register, log in, create posts, and see a feed of posts from other registered users. Udagram uses AWS as its IaaS (Infrastructure as a Service) and CircleCI for CI/CD.

You can access a working version of the application here: [Udagram](http://bucketxnd0067xc4x63090216181632238.s3-website-us-west-2.amazonaws.com)

<br>

## Setting Up Your Own Instance

### Prerequisites
- AWS Account
- [AWS CLI](https://aws.amazon.com/cli/)
- [EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)

### Steps
1. Create an IAM user in the AWS console with **Programmatic Access** type and give it Administrator Access
	- **IMPORTANT**: Copy the user's **Access Key ID** and **Secret Access Key** to a safe place
2. Create a S3 bucket using the following values:
	- **Bucket Name**: *Your Bucket Name*
	- **AWS Region**: *Default*
	- **Object Ownership**: *ACLs Enabled*
	- **Block all public Access**: *No*
3. Go to **Permissions** tab of your bucket and add a bucket policy to allow other AWS services access to the bucket:
	```
	{
		"Version": "2012-10-17",
		"Id": "[Your Policy Id]",
		"Statement": [
			{
				"Sid": "[Your SID]",
				"Effect": "Allow",
				"Principal": "*",
				"Action": "s3:*",
				"Resource": "arn:aws:s3:::[Your Bucket Name]/*"
			}
		]
	}
	```
	- You may generate a policy using the [AWS Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html) tool
4. Add CORS configuration to allow outside applications to interact with the bucket:
	```
	[
		{
			"AllowedHeaders": [
 				"*",
 				"Content-Type",
 				"Authorization",
 				"Access-Control-Allow-Origin",
 				"Access-Control-Allow-Headers",
 				"Access-Control-Allow-Methods"
			],
			"AllowedMethods": [
 				"POST",
 				"GET",
 				"PUT",
 				"DELETE",
 				"HEAD"
			],
			"AllowedOrigins": [
 				"*"
			],
			"ExposeHeaders": []
	 	}
	]
	```
5. Create a PostgreSQL database in the RDS Dashboard using the following values:
	- **Database Creation Method**: *Standard*
	- **Engine Option**: *PostgreSQL 13*
	- **Templates**: *Free Tier*
	- **Database Name**: *Your Database Name*
	- **Master Username**: *Your Username*
	- **Master Password**: *Your Password*
	- **Instance Configuration**: *Burstable class,  db.t3.micro*
	- **VPC and Subnet**: *Default*
	- **Public Access**: *YES*
	- **VPC Security Group**: *Default*
	- **Availability Zone**: *No Preference*
	- **Database Port**: *5432*
	- **Initial Database Name**: *postgres*
6. Navigate to the **Connectivity & Security** tab of your database instance, and edit the security group's inbound rule to include incoming connections from anywhere (0.0.0.0/0)
7. Within the `udagram` directory, update the `set_env.sh` file with your respective environment variable values
8. Update `set_env.sh` with two new environment variables:
	- **AWS_ACCESS_KEY_ID**: From Step 1
	- **AWS_SECRET_ACCESS_KEY**: From Step 1

9. Configure an Elastic Beanstalk environment by navigating to `udagram/udagram-api` in your console and type `eb init`
10. Create an EC2 Key Pair using the [Create Key Pairs Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html) (Make sure to store this key pair in your `.ssh` folder)
11. While still in teh `udagram-api` directory, use `eb create` to bundle and deploy the `udagram-api` application
	```
	eb create --single --keyname <your-key-pair-name> --instance-types t2.medium
	```

<br>

## Running Locally

### Running the Backend
To run the backend application:
1. Navigate to `udagram-api` in your console
	```
	cd udagram-api
	```
2. Install dependencies
	```
	npm install
	```
3. Build the application
	```
	npx tsc
	```
4. Run the application
	```
	npm run dev
	```
The backend application will run on port `8080`.

### Running the Frontend
In a second terminal, run the frontend application:
1. Navigate to `udagram-frontend` in your console
	```
	cd udagram-frontend
	```
2. Install dependencies forcefully
	```
	npm install -f
	```
3. Build the application
	```
	ionic build
	```
3. Run the application
	```
	ionic serve
	```

<br>

In your browser, go to `http://localhost:8100` and you should see the application running successfully:

<img src="./screenshots/udagram_home.png" width="500" />

<br>

## Testing

This project contains two different test suites:
- Unit Tests
	- Unit tests are using the [Jasmine](https://jasmine.github.io)
- End-To-End (e2e) Tests
	- E2E tests are using [Protractor](https://www.protractortest.org/#/) and Jasmine

### Steps
Follow these steps to run unit and e2e tests respectively:
1. `cd starter/udagram-frontend`
2. `npm run test`
3. `npm run e2e`

There are no units tests for the backend application

<br>

## Documentation
Documentation on the architecture of Udagram can be found in the `docs` directory:
- [Infrastructure Description](docs/infrastructure_description.md)
- [Application Dependencies](docs/application_dependencies.md)
- [Pipeline Description](docs/pipeline_description.md)

<br>

## License

[LICENSE](LICENSE.txt)
