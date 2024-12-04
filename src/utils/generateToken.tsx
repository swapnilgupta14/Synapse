export const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};

export const generateToken = async (userId: number, username: string): Promise<string> => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const dataToHash = `${userId}-${username}-${timestamp}-${randomString}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(dataToHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = arrayBufferToHex(hashBuffer);

    return hashHex.substring(0, 32);
};