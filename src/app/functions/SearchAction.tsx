export default async function SearchAction(searchQuery: string) {
    const response = await fetch(`http://localhost:8080/search?q=${searchQuery}`, {
        method: "GET",
    });
    const data = await response.json();

    console.log(data);
    return data;
}