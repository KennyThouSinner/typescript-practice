export let responses = {

    missing_permissions: `
**\`\`\`
So you ran into a 'missing-perms' error with my mute command? Well, we got you covered!\`\`\`**

Firstly,
Check if I have the **MANAGE_ROLES** permission so I am able to add roles to members.

Secondly,
Check if the **\`Muted\`** role is above the **Bot's** highest role, because I **cannot** add a role that has a higher position than my highest role.

Thirdly, 
Make sure **you are not** using this command on a ***bot*** because I cannot take away the other bot's default role that was created upon joining your guild.`,
    invalid_member: `
**\`\`\`
The 'invalid-member' error is a pretty straight forward error. It could've been caused by either of the following:\`\`\`**

Firstly, 
If you provided a **member id**, please make sure that **the member** *is* in **the guild** and that the client **can** indeed see the member.

Secondly,
If you **mentioned a member**, please contact the bot developers because this might be a **cache** related issue. We will need to improve this method and try to get around it. `
}