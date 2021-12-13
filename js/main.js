import postApi from './api/postApi';

async function main() {
  // params sau dấu hỏi url , will auto convert to '_page=1&_limit=5'
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };

    const data = await postApi.getAll(queryParams);
    console.log('api post data', data);
  } catch (error) {
    console.log('get all failed');
    // you can show modal , toash messeage at here.
  }
}
main();
