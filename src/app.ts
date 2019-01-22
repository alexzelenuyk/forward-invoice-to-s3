export const handler = async (event: any = {}): Promise<any> => {
    
    console.log('receipt', event.Records[0].ses);

    const response = JSON.stringify(event, null, 2);
    return response;
}
