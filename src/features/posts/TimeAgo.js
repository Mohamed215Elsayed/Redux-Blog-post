import { parseISO, formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ timestamp }) => {
    let timeAgo = '';
    if (timestamp) {
        const date = parseISO(timestamp);//parse date from timestamp("2024-06-30T12:34:56Z") to 
        // be js object(June 30, 2024, at 12:34:56 in UTC.)
        const timePeriod = formatDistanceToNow(date);
        // console.log(timePeriod); // Outputs something like "6 months ago" or "in 2 days || or i minutes" 
        timeAgo = `${timePeriod} ago`;
    }

    return (
        <span title={timestamp}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    )
}
export default TimeAgo;