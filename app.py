import math
import streamlit as st

st.set_page_config(page_title="Тръбна задръжка (серпентина)", page_icon="🌀", layout="wide")


def reynolds_number(rho: float, velocity: float, diameter_m: float, mu_pa_s: float) -> float:
    return (rho * velocity * diameter_m) / mu_pa_s


def darcy_friction_factor(re: float, roughness_m: float, diameter_m: float) -> float:
    if re <= 0:
        return 0.0
    if re < 2300:
        return 64.0 / re

    rel_roughness = roughness_m / diameter_m
    # Swamee-Jain explicit approximation (turbulent)
    return 0.25 / (math.log10((rel_roughness / 3.7) + (5.74 / (re ** 0.9))) ** 2)


def calculate_retention_coil(
    flow_m3_h: float,
    retention_time_s: float,
    diameter_mm: float,
    roughness_mm: float,
    rho: float,
    mu_mpa_s: float,
    straight_segment_m: float,
    k_elbow_90: float,
    include_inlet_outlet_k: bool,
):
    q_m3_s = flow_m3_h / 3600.0
    diameter_m = diameter_mm / 1000.0
    roughness_m = roughness_mm / 1000.0
    mu_pa_s = mu_mpa_s / 1000.0

    area = math.pi * (diameter_m ** 2) / 4.0
    velocity = q_m3_s / area

    required_volume_m3 = q_m3_s * retention_time_s
    length_m = required_volume_m3 / area

    n_straights = max(1, math.ceil(length_m / straight_segment_m))
    n_uturns = max(0, n_straights - 1)
    elbows_90 = n_uturns * 2

    re = reynolds_number(rho, velocity, diameter_m, mu_pa_s)
    f = darcy_friction_factor(re, roughness_m, diameter_m)

    k_total = elbows_90 * k_elbow_90
    if include_inlet_outlet_k:
        k_total += 1.5

    dynamic_pressure = rho * (velocity ** 2) / 2.0
    dp_distributed_pa = f * (length_m / diameter_m) * dynamic_pressure
    dp_local_pa = k_total * dynamic_pressure
    dp_total_pa = dp_distributed_pa + dp_local_pa

    return {
        "flow_m3_s": q_m3_s,
        "velocity": velocity,
        "required_volume_m3": required_volume_m3,
        "length_m": length_m,
        "n_straights": n_straights,
        "n_uturns": n_uturns,
        "elbows_90": elbows_90,
        "re": re,
        "f": f,
        "k_total": k_total,
        "dp_distributed_pa": dp_distributed_pa,
        "dp_local_pa": dp_local_pa,
        "dp_total_pa": dp_total_pa,
    }


st.title("Пресмятане на тръбна задръжка тип серпентина")
st.caption(
    "MVP калкулатор за вода и течни млечни продукти. Изчисленията са по SI подход "
    "(Darcy-Weisbach + локални съпротивления), използван в европейската инженерна практика."
)

with st.sidebar:
    st.header("1) Флуид")
    fluid_option = st.selectbox(
        "Изберете продукт",
        ["Вода (20°C)", "Мляко (цяло, ~20°C)", "Обезмаслено мляко (~20°C)", "Суроватка (~20°C)", "Сметана 20% (~20°C)", "Ръчно въвеждане"],
    )

    fluid_db = {
        "Вода (20°C)": {"rho": 998.0, "mu": 1.00},
        "Мляко (цяло, ~20°C)": {"rho": 1030.0, "mu": 2.00},
        "Обезмаслено мляко (~20°C)": {"rho": 1035.0, "mu": 1.70},
        "Суроватка (~20°C)": {"rho": 1025.0, "mu": 1.30},
        "Сметана 20% (~20°C)": {"rho": 1010.0, "mu": 5.00},
    }

    default_rho = 1000.0
    default_mu = 1.0
    if fluid_option in fluid_db:
        default_rho = fluid_db[fluid_option]["rho"]
        default_mu = fluid_db[fluid_option]["mu"]

    rho = st.number_input("Плътност ρ [kg/m³]", min_value=800.0, max_value=1300.0, value=float(default_rho), step=1.0)
    mu = st.number_input("Динамичен вискозитет μ [mPa·s]", min_value=0.2, max_value=500.0, value=float(default_mu), step=0.1)

    st.header("2) Хидравлични и геометрични входове")
    flow_m3_h = st.number_input("Дебит Q [m³/h]", min_value=0.01, max_value=200.0, value=5.0, step=0.1)
    retention_time_s = st.number_input("Целева задръжка t [s]", min_value=1.0, max_value=3600.0, value=60.0, step=1.0)
    diameter_mm = st.number_input("Вътрешен диаметър D [mm]", min_value=5.0, max_value=300.0, value=25.0, step=0.5)

    roughness_source = st.selectbox("Тип тръба", ["Неръждаема хранителна тръба (гладка)", "Техническа стомана", "Ръчно ε"])
    if roughness_source == "Неръждаема хранителна тръба (гладка)":
        roughness_mm = st.number_input("Грапавост ε [mm]", min_value=0.0005, max_value=0.1, value=0.0015, step=0.0005)
    elif roughness_source == "Техническа стомана":
        roughness_mm = st.number_input("Грапавост ε [mm]", min_value=0.001, max_value=0.2, value=0.045, step=0.001)
    else:
        roughness_mm = st.number_input("Грапавост ε [mm]", min_value=0.0001, max_value=1.0, value=0.01, step=0.0001)

    straight_segment_m = st.number_input("Дължина на права секция между U-обръщания [m]", min_value=0.2, max_value=20.0, value=2.0, step=0.1)
    k_elbow_90 = st.number_input("Коефициент за едно коляно 90° (K)", min_value=0.1, max_value=2.0, value=0.9, step=0.05)
    include_io = st.checkbox("Добави вход/изход локални загуби (общо K≈1.5)", value=True)

results = calculate_retention_coil(
    flow_m3_h=flow_m3_h,
    retention_time_s=retention_time_s,
    diameter_mm=diameter_mm,
    roughness_mm=roughness_mm,
    rho=rho,
    mu_mpa_s=mu,
    straight_segment_m=straight_segment_m,
    k_elbow_90=k_elbow_90,
    include_inlet_outlet_k=include_io,
)

col1, col2, col3 = st.columns(3)
col1.metric("Дължина на тръбата [m]", f"{results['length_m']:.2f}")
col2.metric("Брой колена 90°", f"{results['elbows_90']}")
col3.metric("Общо съпротивление ΣK [-]", f"{results['k_total']:.2f}")

st.subheader("Хидравлични резултати")
r1, r2, r3 = st.columns(3)
r1.metric("Скорост v [m/s]", f"{results['velocity']:.3f}")
r2.metric("Reynolds Re [-]", f"{results['re']:.0f}")
r3.metric("Коеф. на триене f [-]", f"{results['f']:.4f}")

r4, r5, r6 = st.columns(3)
r4.metric("Пад на налягане по дължина Δpₗ [kPa]", f"{results['dp_distributed_pa'] / 1000:.2f}")
r5.metric("Локални загуби Δpₗₒc [kPa]", f"{results['dp_local_pa'] / 1000:.2f}")
r6.metric("Общ пад на налягане Δp [kPa]", f"{results['dp_total_pa'] / 1000:.2f}")

with st.expander("Използвани формули"):
    st.markdown(
        """
- Необходим обем за задръжка: **V = Q · t**
- Площ на сечение: **A = πD²/4**
- Дължина: **L = V/A**
- Скорост: **v = Q/A**
- Reynolds: **Re = ρvD/μ**
- Общо съпротивление: **ΣK = n·K(90°) + Kвход/изход**
- Darcy-Weisbach: **Δp = (f·L/D + ΣK)·ρv²/2**

Този инструмент е за предварително оразмеряване. За окончателен проект потвърдете параметрите по
вътрешнофирмен стандарт и приложимите EN изисквания за конкретната инсталация.
"""
    )

st.info(
    "За млечни продукти при различна температура въведете ръчно плътност и вискозитет. "
    "Температурата влияе силно на вискозитета и съпротивлението."
)
