import axios from "axios";
import type { quiz } from "./interfaces";

const api = axios.create({
	baseURL: ""
})

export async function get() {
	return null
}

export async function github(): Promise<quiz[]> {
	const { data } = await axios.get(
		`https://api.github.com/gists/eb870458fadf06fdf48255005d378c2d`,
	);
	return JSON.parse(data.files["bible.json"].content);
}
