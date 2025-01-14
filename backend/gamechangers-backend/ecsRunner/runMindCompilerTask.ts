import { ECS } from "aws-sdk";

// Define a type for the security group configuration
type SecurityGroupConfig = {
	securityGroups: string[];
};

// Define a type for the network configuration
type NetworkConfig = {
	awsvpcConfiguration: {
		subnets: string[];
		assignPublicIp: "ENABLED" | "DISABLED";
	} & SecurityGroupConfig;
};

// Define a type for the container override
type ContainerOverride = {
	name: string;
	environment: {
		name: string;
		value: string;
	}[];
};

// Define a type for the task overrides
type TaskOverrides = {
	containerOverrides: ContainerOverride[];
};

interface RunMindCompilerTaskParams {
	cardId: string;
	// Include any additional parameters you want to pass to the container
}

export async function runMindCompilerTask(
	params: RunMindCompilerTaskParams,
): Promise<void> {
	const ecs = new ECS();

	// Use the defined types for better type safety
	const networkConfig: NetworkConfig = {
		awsvpcConfiguration: {
			subnets: ["subnet-0222205b78f10b64d", "subnet-0d142ce3d1cbe87d9"],
			assignPublicIp: "ENABLED",
			securityGroups: ["sg-0ff3c152b2a3559b0"],
		},
	};

	const containerOverride: ContainerOverride = {
		name: "mind-compiler-image",
		environment: [
			{
				name: "CARD_ID",
				value: params.cardId,
			},
		],
	};

	const taskOverrides: TaskOverrides = {
		containerOverrides: [containerOverride],
	};

	const runTaskParams: ECS.RunTaskRequest = {
		cluster: "OnFireCluster",
		launchType: "FARGATE",
		taskDefinition: "mind-compiler-task-family:1",
		networkConfiguration: networkConfig,
		overrides: taskOverrides,
	};

	await ecs.runTask(runTaskParams).promise();
}
