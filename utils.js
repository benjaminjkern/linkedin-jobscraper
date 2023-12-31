import { db, totalNumJobs } from "./jobs.js";

export const ratioColumnFilter = async (column, textToInclude) => {
    process.stdout.write(`${textToInclude}: `);
    return await ratioFilter(`${column} LIKE '%${textToInclude}%'`);
};

export const ratioFilter = async (sqlFilter) => {
    const allJobs = await totalNumJobs();
    const filtered = (
        await db.get(`SELECT COUNT(*) FROM jobs WHERE ${sqlFilter}`)
    )["COUNT(*)"];
    console.log(
        filtered,
        "/",
        allJobs,
        `${Math.round((filtered / allJobs) * 100)}%`
    );
};

const scramble = (list) => {
    for (let i = 0; i < list.length; i++) {
        const r = Math.floor(Math.random() * list.length);
        [list[i], list[r]] = [list[r], list[i]];
    }
};

export const lookAtJobs = (inputJobs) => {
    let returnString = `# Filtered Jobs report\nJobs selected: ${inputJobs.length}\n`;
    const allJobs = [...inputJobs];
    scramble(allJobs);
    for (const {
        jobId,
        jobTitle,
        companyName,
        location,
        extraInfo,
        jobPostExtraInfo,
        details,
        companyExtraInfo,
    } of allJobs) {
        returnString += `# ${jobTitle} @ ${companyName} (${location})\n<details>\n\n> https://linkedin.com/jobs/search/?currentJobId=${jobId}\n\n${
            companyExtraInfo || ""
        }\n\n${jobPostExtraInfo ? jobPostExtraInfo + " · " : ""}${extraInfo
            .split("\n")
            .join("\n\n")}\n\`\`\`\n${details}\n\`\`\`\n</details>\n\n`;
    }
    return returnString;
};
