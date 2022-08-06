import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const toAgo = (modifiedAt) => dayjs().to(dayjs(new Date(modifiedAt).toISOString()));

export default toAgo;
