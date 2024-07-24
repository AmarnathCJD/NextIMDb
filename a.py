from aiohttp import web
import bs4
from aiohttp import ClientSession, ClientTimeout
from requests import get
from urllib.parse import quote
import re


def search_(query):
    r = get(f"https://www.imdb.com/find/?q={quote(query)}&s=tt&ref_=fn_al_tt_mr", headers={"User-Agent": "Mozilla/5.0"})
    soup = bs4.BeautifulSoup(r.text, "html.parser")

    results = []
    try:
        items = soup.find_all("li", class_="ipc-metadata-list-summary-item")
        for item in items:
            if not item.find("img"):
                continue
            img = re.search(
                r"src=\"(.*?)\"", str(item.find("img"))).group(1).split("._V1")[0] + "._V1_QL75_UY207_CR13,0,140,207_.jpg"
            results.append({"title": item.find("img")[
                           "alt"], "img": img, "id": re.search(r"tt\d+", str(item)).group(0)})
    except Exception as e:
        print(e)
        return []

    return results


async def search_adv(q: str):
    req_url = "https://attackertv.so/search/{}".format(q.replace(" ", "-"))
    async with ClientSession(timeout=ClientTimeout(total=10)) as session:
        req = await session.get(req_url)
        try:
            soup = bs4.BeautifulSoup(await req.text(), "html.parser")
            titles = []
            for title in soup.find_all("div", class_="flw-item"):
                titles.append({
                    "title": title.find("a").get("title") if title.find("a") else "Unknown",
                    "href": title.find("a").get("href") if title.find("a") else "Unknown",
                    "category": title.find("span", class_="float-right fdi-type").text.strip() if title.find("span", class_="float-right fdi-type") else "Unknown",
                    "poster": title.find("img").get("data-src") if title.find("img") else "Unknown",
                    "quality": title.find("div", class_="pick film-poster-quality").text.strip() if title.find("div", class_="pick film-poster-quality") else "Unknown",
                })

            return titles

        except Exception as e:
            return []


@web.middleware
async def error_middleware(request, handler):
    try:
        response = await handler(request)
        return response
    except web.HTTPException as ex:
        return web.json_response({"error": ex.text}, status=ex.status)
    except Exception as ex:
        return web.json_response({"error": str(ex)}, status=500)


async def search(request):
    q = request.query.get("q")
    if not q:
        raise web.HTTPBadRequest(text="Query parameter is required")
    result = search_(q)
    return web.json_response(result, headers={"Access-Control-Allow-Origin": "*"})


async def movie(request):
    q = request.query.get("q")
    if not q:
        raise web.HTTPBadRequest(text="Query parameter is required")
#  \
# interface Title {
#     title: string;
#     year: number;
#     rating: number;
#     description: string;
#     img: string;
# }

    req = get(f"https://www.imdb.com/title/{q}/", headers={"User-Agent": "Mozilla/5.0"})
    soup = bs4.BeautifulSoup(req.text, "html.parser")
    
    title = soup.find(attrs={"data-testid": "hero__primary-text"}).text
    year = re.search(r"\d{4}", soup.find(class_="sc-1f50b7c-0").text).group(0)
    rating = soup.find(class_="sc-eb51e184-1").text
    description = soup.find(attrs={"data-testid": "plot-xs_to_m"}).text
    img = re.search(r"src=\"(.*?)\"", str(soup.find(class_="ipc-media--poster-27x40"))).group(1).split("._V1")[0] + "._V1_QL75_UY562_CR35,0,380,562_.jpg"
    
    data = {
        "title": title,
        "year": year,
        "rating": rating,
        "description": description,
        "img": img
    }

    return web.json_response(data, headers={"Access-Control-Allow-Origin": "*"})

app = web.Application()
app = web.Application(middlewares=[error_middleware])
app.router.add_get("/search", search)
app.router.add_get("/movie", movie)

web.run_app(app, port=8080)
