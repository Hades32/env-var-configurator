import balena from 'balena-sdk';
import express from 'express';

const app = express();
const sdk = balena.getSdk();
await sdk.auth.loginWithToken(process.env.BALENA_API_KEY);

const port = 8080;

app.get('/', (req, res) => {
	res.send('This is the configurator speaking!');
});

app.get('/test', async (req, res) => {
	const device = await sdk.models.device.get(process.env.BALENA_DEVICE_UUID);
	console.log({ config:device.device_config_variable });
	// console.log({ device });
	if (!device.is_running__release.__id) {
		res.status(400).json({ error: 'no release set' });
		return;
	}
	const release = await sdk.models.release.get(device.is_running__release.__id);
	// console.log({ release });
	const composition = release.composition ?? demoCompose;
	const svcs = Object.entries(composition.services).reduce(
		(x, [name, svc]) => ({ ...x, [name]: svc.environment }),
		{},
	);
	res.json({
		svcs,
		global: [...new Set(Object.values(svcs).flatMap(Object.keys))],
	});
});

app.listen(port, () => {
	console.log(`Configurator balenaBlock listening at http://0.0.0.0:${port}`);
});
