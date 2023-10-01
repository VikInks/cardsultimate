import {AxiosInterface, RequestAx} from "../../config/interfaces/adapters/axios.interface";
import axios from "axios";

export class AxiosAdapter implements AxiosInterface {
    constructor() {}

    public request: RequestAx = axios;
}