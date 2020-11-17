import { Octokit } from '@octokit/rest'


export default class Github {

  private octokit = new Octokit({ auth: process.env.GH_TOKEN });

  async updateGist(
    title: string,
    content: string
  ): Promise<string> {
    const gist_id = process.env.GIST_ID || '';
    const gist = await this.octokit.gists.get({ gist_id });
    const filename = Object.keys(gist.data.files)[0];
    await this.octokit.gists.update({
      gist_id,
      files: {
        [filename]: {
          filename: title,
          content,
        },
      },
    });
    return gist.url;
  }
}
