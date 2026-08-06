import {
    addPortfolioImage,
    getPortfolioImages,
    removePortfolioImage,
    uploadPortfolioImage,
} from "@/lib/firebase/portfolio.service";

/**
 * Returns every portfolio image URL.
 */
export async function getPortfolio(
    memberId: string,
): Promise<string[]> {

    return getPortfolioImages(memberId);

}

/**
 * Uploads an image to Storage,
 * then adds its URL to the SkillMember document.
 */
export async function uploadPortfolio(

    memberId: string,

    file: File,

): Promise<string> {

    const imageUrl =

        await uploadPortfolioImage(
            memberId,
            file,
        );

    await addPortfolioImage(

        memberId,

        imageUrl,

    );

    return imageUrl;

}

/**
 * Removes an image from the portfolio list.
 *
 * (We'll also delete it from Firebase Storage later.)
 */
export async function deletePortfolioImage(

    memberId: string,

    imageUrl: string,

): Promise<void> {

    await removePortfolioImage(

        memberId,

        imageUrl,

    );

}