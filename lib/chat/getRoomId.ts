export function getRoomId(

    currentUserId: string,
    targetUserId: string,

): string {

    const ids = [

        currentUserId,
        targetUserId,

    ].sort();

    return `${ids[1]}_${ids[0]}`;

}